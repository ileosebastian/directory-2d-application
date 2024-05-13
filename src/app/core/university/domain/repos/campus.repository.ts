import { Campus } from "../campus.domain";

export interface CampusRepository {
    getAllCampus(): Promise<Campus[]>;
}