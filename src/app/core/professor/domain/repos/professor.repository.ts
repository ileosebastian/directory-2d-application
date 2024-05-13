import { DetailProfessor, Professor } from "../professor.domain";


export interface ProfessorRepository {
    getAllProfessors(isByCampus: boolean, facultyOrCampusName: string, limit: number, loadMoreData: boolean, isReload: boolean): Promise<Professor[]>;

    getProfessorsByName(isCampus: boolean, facultyOrCampusName: string, name: string): Promise<Professor[]>;

    getProfessorById(id: string): Promise<Professor>;

    getDetailProfessorById(id: string): Promise<DetailProfessor>;
}