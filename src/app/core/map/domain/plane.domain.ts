import { UUID } from "../../shared/models/core.types";
import { Grid } from "../../tour/domain/grid.domain";
import { Waypoint } from "../../tour/domain/waypoint.domain";


export interface Plane extends Grid {
    id?: string;
    floor: number;
    wayPoints: Waypoint[];
    uuid: UUID;
    buildingId: UUID;
}

export interface PlaneParsed {
    id?: string;
    columns: number;
    rows: number;

    widthTiles: number;
    heightTiles: number;

    stage: string;

    uuid: UUID;
    floor: number;
    waypoints: string;
    buildingId: UUID

    published: boolean;
}