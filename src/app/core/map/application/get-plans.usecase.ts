import { MapRepository } from "../domain/repos/map.repository";

import { Box } from "../../tour/domain/box.domain";
import { Waypoint } from "../../tour/domain/waypoint.domain";
import { Plane } from "../domain/plane.domain";


export class GetPlansUseCase {

    constructor(private readonly mapRepo: MapRepository) { }

    async run(facultyName: string) {
        const allPlans: Plane[] = [];
        try {
            const building = await this.mapRepo.getBuildingByFaculty(facultyName);

            const allRawPlans = await this.mapRepo.getPlansByBuildingId(building.uuid, building.floors);

            allRawPlans.forEach(rawPlan => {
                allPlans.push({
                    id: rawPlan?.id,
                    uuid: rawPlan.uuid,
                    floor: rawPlan.floor,
                    wayPoints: JSON.parse(rawPlan.waypoints) as Waypoint[],
                    buildingId: rawPlan.buildingId,
                    columns: rawPlan.columns,
                    rows: rawPlan.rows,
                    widthTiles: rawPlan.widthTiles,
                    heightTiles: rawPlan.heightTiles,
                    stage: JSON.parse(rawPlan.stage) as Box[][]
                });
            });

            return allPlans;
        } catch (error) {
            console.error("=>", error);
            return allPlans;
        }
    }

}