import { UUID } from "../../shared/models/core.types";


export interface Building {
    id?: string;
    campus: string;
    faculty: string;
    name: string;
    floors: number;
    uuid: UUID;
}
