import { UUID } from "../../shared/models/core.types";


export interface Entry {
    category: string;
    title: string;
    waypointId: UUID;
}