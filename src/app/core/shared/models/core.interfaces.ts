import { QueryConstraintType } from "@angular/fire/firestore"
import { Professor } from "../../professor/domain/professor.domain"
import { Place } from "../../place/domain/place.domain"
import { KeyPlacePagination, UUID } from './core.types';
import { Building } from "../../map/domain/building.domain"
import { PlaneParsed } from "../../map/domain/plane.domain"
import { Faculty } from "../../university/domain/faculty.domain"

export interface SetStatement {
    statement: string;
    values: any[]
}

export interface FacultiesByCampus {
    [key: string]: Faculty[]
}

export interface FacultiesByCampusPagination {
    [key: string]: {
        lastNameValue: string | null,
        faculties: Faculty[]
    }
}

export interface ProfessorsByFacultyAndPage {
    [key: string]: { // faculty or campus
        lastValue: Professor | null | number,
        professors: Professor[]
    }
}

export interface PlacesByFacultyAndCategoryAndPage {
    [key: KeyPlacePagination]: {
        lastValue: Place | null | number,
        places: Place[]
    }
}

export interface Constrains {
    type: QueryConstraintType,
    field?: string,
    filter?: '==' | '!=',
    value?: string | unknown | unknown[] | number
}

export interface BuildingByFacultyPagination {
    [key: string]: Building;
}

export interface PlansParsedByBuildingIdPagination {
    [key: UUID]: PlaneParsed[];
}
