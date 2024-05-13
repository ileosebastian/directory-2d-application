import { Block } from "./block.domain";
import { UUID, WaypointType } from "../../shared/models/core.types";


export interface Waypoint extends Block {
    name: string;
    pointType: WaypointType;
    uuid: UUID;
}