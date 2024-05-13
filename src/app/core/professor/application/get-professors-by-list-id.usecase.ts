import { ProfessorRepository } from "../domain/repos/professor.repository";

import { GetAllDetailsProfessorUseCase } from "./get-all-data-professor.usecase";

import { AllDetailsProfessor } from "../domain/professor.domain";


export class GetProfessorsByListIdUseCase {

    private readonly getProfessor!: GetAllDetailsProfessorUseCase;

    constructor(private readonly profeRepo: ProfessorRepository) {
        this.getProfessor = new GetAllDetailsProfessorUseCase(this.profeRepo);
    }

    async run(listId: string[]) {
        const professors: AllDetailsProfessor[] = [];

        listId.forEach(async id => {
            const profe = await this.getProfessor.run(id);
            professors.push(profe);
        });

        return professors;
    }

}