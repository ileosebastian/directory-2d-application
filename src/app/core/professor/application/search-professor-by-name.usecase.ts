import { ProfessorRepository } from "../domain/repos/professor.repository";

import { ALL_FACULTIES_KEY } from "../../shared/data/constants.data";


export class SearchProfessorByNamesUseCase {

    constructor(private readonly profeRepo: ProfessorRepository) { }

    async run(criteria: string, value: string, name: string) {
        return await this.profeRepo.getProfessorsByName(criteria === ALL_FACULTIES_KEY, value, name);
    }

}