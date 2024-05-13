import { ProfessorRepository } from "../domain/repos/professor.repository";

import { AllDetailsProfessor } from "../domain/professor.domain";


export class GetAllDetailsProfessorUseCase {

    constructor(private readonly profeRepo: ProfessorRepository) { }

    async run(professorId: string): Promise<AllDetailsProfessor> {
        const professor = await this.profeRepo.getProfessorById(professorId);

        const detailProfessor = await this.profeRepo.getDetailProfessorById(professor.infoId);

        if (professor && detailProfessor) {
            return {
                id: professor.id,
                name: professor.name,
                email: detailProfessor.email,
                campus: professor.campus,
                faculty: professor.faculty,
                department: professor.department || 'Sin departamento definido',
                office: professor.office || 'Sin oficina definida',
                dedication: detailProfessor.dedication,
                category: detailProfessor.category,
                schedule: detailProfessor.schedule
            }
        } else {
            throw new Error("Error to search professor details...");
        } 
    }

}