import { FacultyRepository } from "../domain/repos/faculty.repository";


export class GetAllFacultiesUseCase {

    constructor(private readonly facuRepo: FacultyRepository) {}

    async run() {
        return await this.facuRepo.getAllFaculties();
    }

}
