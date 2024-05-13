import { ProfessorRepository } from "../domain/repos/professor.repository";


export class SearchProfessorsUseCase {

    constructor(private readonly profeRepo: ProfessorRepository) { }

    async run(criteria: string, value: string, limit: number, loadMoreData: boolean, isReload: boolean) {
        return await this.profeRepo.getAllProfessors(criteria === 'todos', value, limit, loadMoreData, isReload);
    }

}