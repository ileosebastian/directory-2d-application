import { FacultyRepository } from "../domain/repos/faculty.repository";


export class GetFacultyListByCampusUseCase {
    constructor(private readonly facuRepo: FacultyRepository) {}

    async run(campusName: string) {
        return await this.facuRepo.getAllFacultiesByCampus(campusName);
    }

}