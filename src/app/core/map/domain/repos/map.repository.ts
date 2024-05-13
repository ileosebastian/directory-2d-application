import { UUID } from "src/app/core/shared/models/core.types";
import { Building } from "../building.domain";
import { PlaneParsed } from "../plane.domain";


export interface MapRepository {
    getBuildingByFaculty(facultyName: string): Promise<Building>;
    getPlansByBuildingId(buildingId: UUID, limitOfFloors: number): Promise<PlaneParsed[]>;
}