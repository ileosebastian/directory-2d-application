import { UUID } from "../../shared/models/core.types";


export interface Place {
    id?: string;
    uuid: UUID;
    name: string;
    title: string;
    category: string;
    code: string;
    campus: string;
    faculty: string;
    planeId: UUID;

    wayPointId: UUID;
    published: boolean;
}

export interface DetailPlace {  
    id?: string;
    placeId: UUID;
    belongsProfessor: boolean;
    professorsId: string[];
    
    floor: number;
    
    wayPointId?: UUID;
    published?: boolean;
}

export interface AllDetailsPlace {
    id: UUID;
    title: string;
    code: string;
    category: string;
    campus: string;
    faculty: string;

    belongsProfessor: boolean;
    professorsId: string[];
    wayPointId: UUID;

    floor: number;
}