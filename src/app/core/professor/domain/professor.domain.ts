import { UUID } from "../../shared/models/core.types";

interface Schecule {
    first: string;
    second: string;
}

export interface Professor {
    id: string;
    name: string;
    isVisible: boolean;
    campus: string;
    faculty: string;
    office?: string; // Place
    department?: string;
    infoId: UUID;
    published: boolean;
}

export interface DetailProfessor {
    uuid: UUID;
    category: string;
    dedication: string;
    email: string;
    schedule: Schecule;
    published: boolean;
}

export interface AllDetailsProfessor {
    id: string;
    name: string;
    email: string;
    campus: string;
    faculty: string;
    department: string;
    office: string;
    dedication: string;
    category: string;
    schedule: Schecule;
}