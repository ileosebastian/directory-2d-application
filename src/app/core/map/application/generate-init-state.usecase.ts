import { AddNeigborsUseCase } from "./add-neighbors.usecase";
import { GenerateWayfindingUseCase } from "./generate-wayfinding.usecase";
import { GetPlansUseCase } from "./get-plans.usecase";
import { FindBoxByPointTypeUseCase } from "./find-box-by-point-type.usecase";
import { GetBoxAndPlaneByWaypointIdUseCase } from "./get-box-and-plane-by-waypoint-id.usecase";

import { MapRepository } from "../domain/repos/map.repository";

import { Blueprint } from '../../tour/domain/tour.domain';
import { Box } from "../../tour/domain/box.domain";
import { Plane } from "../domain/plane.domain";
import { KindOption, UUID } from '../../shared/models/core.types';

import { isABlock } from "../../shared/utils/is-a-block.util";


export class GenerateInitStateUseCase {

    private ALL_PLANS_PER_FLOOR: { [key: number]: Plane } = {};
    private FIRST_START!: { start: Box, plane: Plane };
    private FIRST_GOAL!: { goal: Box, plane: Plane };
    private floors: number[] = [];

    private getPlansUseCase!: GetPlansUseCase;
    private addNeighbors!: AddNeigborsUseCase;
    private generateWayfinding!: GenerateWayfindingUseCase;
    private findBoxByPointType!: FindBoxByPointTypeUseCase;
    private getBoxAndPlane!: GetBoxAndPlaneByWaypointIdUseCase;

    constructor(private readonly mapRepo: MapRepository) {
        this.getPlansUseCase = new GetPlansUseCase(mapRepo);
        this.addNeighbors = new AddNeigborsUseCase();
        this.generateWayfinding = new GenerateWayfindingUseCase();
        this.findBoxByPointType = new FindBoxByPointTypeUseCase();
        this.getBoxAndPlane = new GetBoxAndPlaneByWaypointIdUseCase();
    }

    async run(
        facultyName: string,
        originWaypointId: UUID | null = null,
        destinyWaypointId: UUID
    ): Promise<{ blueprints: Blueprint[], plans: Plane[] }> {
        const plans = await this.getPlansUseCase.run(facultyName);

        if (!plans || plans.length === 0) throw new Error("There are no plans for this item");

        // generate blueprints
        let blueprints: Blueprint[] = [];

        plans.forEach(plane => {
            this.ALL_PLANS_PER_FLOOR[plane.floor] = this.addFullDataPlane(plane);
        });
        this.floors = Object.keys(this.ALL_PLANS_PER_FLOOR).map(Number);

        // get first start Box and first start plane
        if (originWaypointId) {
            const { box, plane } = this.getBoxAndPlane.run(originWaypointId, plans);
            this.FIRST_START = { start: box, plane };
        } else {
            const start = this.findBoxByPointType.run(1, 'origin_first_floor', this.ALL_PLANS_PER_FLOOR);
            this.FIRST_START = { start, plane: this.ALL_PLANS_PER_FLOOR[1] };
        }
        // get first goal Box and first goal plane
        const { box, plane } = this.getBoxAndPlane.run(destinyWaypointId, plans);
        this.FIRST_GOAL = { goal: box, plane };

        /*
            Until the floor of the origin plane is equal to the destination floor,
            you must search between the planes that separate each origin/destination 
            point with its corresponding plane and route to follow according to the 
            shortest path algorithm
        */
        const startPlane = this.FIRST_START.plane;
        const goalPlane = this.FIRST_GOAL.plane;

        if (this.FIRST_START.plane.floor === this.FIRST_GOAL.plane.floor) { // just once
            blueprints = this.getBlueprintsByFloorList(this.floors, 'once');
        }
        if (this.FIRST_START.plane.floor < this.FIRST_GOAL.plane.floor) { // descending path
            const FLOORS = this.floors
                .sort((a, b) => a - b)
                .filter(floor => floor >= startPlane.floor && floor <= goalPlane.floor);
            blueprints = this.getBlueprintsByFloorList(FLOORS, 'up');
        }
        if (this.FIRST_START.plane.floor > this.FIRST_GOAL.plane.floor) { // ascending path
            const FLOORS = this.floors
                .sort((a, b) => b - a)
                .filter(floor => floor >= goalPlane.floor && floor <= startPlane.floor);
            blueprints = this.getBlueprintsByFloorList(FLOORS, 'down');
        }
        if (blueprints.length > 0)
            return { blueprints, plans };
        else
            throw new Error("Error generating blueprints!");
    }

    private getBlueprintsByFloorList(floors: number[], context: 'up' | 'down' | 'once') {
        const blueprints: Blueprint[] = []
        if (context === 'once') {
            const start = this.FIRST_START.start;
            const goal = this.FIRST_GOAL.goal;
            const plane = this.FIRST_GOAL.plane;
            const path = this.generateWayfinding.run(start, goal, plane);
            if (path)
                blueprints.push({ start, goal, path, plane });
        } else {
            floors.forEach(floor => {
                if (floor === this.FIRST_START.plane.floor) {
                    let start = this.FIRST_START.start;
                    let goal = this.findBoxByPointType
                        .run(
                            floor,
                            context === 'down' ? 'previous_floor' : 'next_floor',
                            this.ALL_PLANS_PER_FLOOR
                        );
                    let plane = this.ALL_PLANS_PER_FLOOR[floor];
                    plane = this.updateDataPlane(plane, context);
                    start = this.addNeighbors.run(plane.stage, start);
                    goal = this.addNeighbors.run(plane.stage, goal);
                    const path = this.generateWayfinding.run(start, goal, plane);
                    if (path)
                        blueprints.push({ start, goal, path, plane });
                }
                if (floor === this.FIRST_GOAL.plane.floor) {
                    const start = this.findBoxByPointType
                        .run(
                            floor,
                            context === 'down' ? 'origin_previous_floor' : 'origin_next_floor',
                            this.ALL_PLANS_PER_FLOOR
                        );
                    const goal = this.FIRST_GOAL.goal;
                    const plane = this.ALL_PLANS_PER_FLOOR[floor];
                    const path = this.generateWayfinding.run(start, goal, plane);
                    if (path)
                        blueprints.push({ start, goal, path, plane });
                }
                if (floor !== this.FIRST_START.plane.floor && floor !== this.FIRST_GOAL.plane.floor) {
                    blueprints.push(this.getBlueprintByContext(floor, context));
                }
            });
        }
        return blueprints;
    }

    private getBlueprintByContext(floor: number, context: 'up' | 'down'): Blueprint {
        let start = this.findBoxByPointType.run(floor, context === 'up' ? 'origin_next_floor' : 'origin_previous_floor', this.ALL_PLANS_PER_FLOOR);
        let goal = this.findBoxByPointType.run(floor, context === 'up' ? 'next_floor' : 'previous_floor', this.ALL_PLANS_PER_FLOOR);
        let plane = this.ALL_PLANS_PER_FLOOR[floor];
        plane = this.updateDataPlane(plane, context);
        start = this.addNeighbors.run(plane.stage, start);
        goal = this.addNeighbors.run(plane.stage, goal);
        const path = this.generateWayfinding.run(start, goal, plane);

        if (path)
            return { start, goal, path, plane };
        else
            throw new Error("Error generating correct init state for animations...");
    }

    private addFullDataPlane(plane: Plane): Plane {
        plane.stage.forEach(col => col.forEach(row => {
            row.kindOption = this.getKindOption(plane.columns, plane.rows, row.x, row.y);
            row = this.addNeighbors.run(plane.stage, row);
        }));
        return plane;
    }

    private updateDataPlane(plane: Plane, context: 'up' | 'down' | 'go'): Plane {
        plane.stage.forEach(col => col.forEach(row => {
            if (row.contain && isABlock(row.contain)) {
                if (context === 'up' && row.contain.blockType === 'invisible_lock_up') {
                    row.isIgnored = true;
                }
                if (context === 'down' && row.contain.blockType === 'invisible_lock_down') {
                    row.isIgnored = true;
                }
            }
            row = this.addNeighbors.run(plane.stage, row);
        }));
        return plane;
    }

    private getKindOption(columns: number, rows: number, x: number, y: number): KindOption {
        const kindOption: KindOption = x === 0 && y === 0 ? 'top-left-corner' :
            x > 0 && x < columns - 1 && y === 0 ? 'top' :
                x === columns - 1 && y === 0 ? 'top-right-corner' :
                    x === 0 && y > 0 && y < rows - 1 ? 'left' :
                        x === columns - 1 && y > 0 && y < rows - 1 ? 'right' :
                            x === 0 && y === rows - 1 ? 'bottom-left-corner' :
                                x > 0 && x < columns - 1 && y === rows - 1 ? 'bottom' :
                                    x === columns - 1 && y === rows - 1 ? 'bottom-right-corner' : 'body';

        return kindOption;
    }

}