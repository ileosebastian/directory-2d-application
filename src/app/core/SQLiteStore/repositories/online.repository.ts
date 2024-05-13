import { Building } from "../../map/domain/building.domain";
import { PlaneParsed } from "../../map/domain/plane.domain";
import { Place } from "../../place/domain/place.domain";
import { Professor } from "../../professor/domain/professor.domain";
import { CampusPermitted, UUID } from "../../shared/models/core.types";
import { Faculty } from "../../university/domain/faculty.domain";


export interface OnlineRepository {

    getALLFacultiesByCampus(campus: CampusPermitted): Promise<Faculty[]>; 

    getALLProfessorsByCampus(campus: CampusPermitted): Promise<Professor[]>;

    getALLBuildingsByCampus(campus: CampusPermitted): Promise<Building[]>;

    getALLPlansByBuildingId(buildingId: UUID): Promise<PlaneParsed[]>
    
    getALLPlacesByCampus(campus: CampusPermitted): Promise<Place[]>;

}
