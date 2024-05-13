import { CampusRepository } from "../domain/repos/campus.repository";


export class GetCampusListUseCase {

    constructor(private readonly campusRepository: CampusRepository) {}

    run() {
        return this.campusRepository.getAllCampus();
    }
}