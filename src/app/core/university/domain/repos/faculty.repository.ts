import { Faculty } from "../faculty.domain";


export interface FacultyRepository {

    getAllFacultiesByCampus(campusName: string): Promise<Faculty[]>;
    getAllFaculties(): Promise<Faculty[]>;

}
