import { Professor } from "../../professor/domain/professor.domain";


export const isAProfessor = (obj: any): obj is Professor => {
    return 'id' in obj &&
        'name' in obj &&
        'campus' in obj &&
        'faculty' in obj &&
        'office' in obj &&
        'department' in obj &&
        'infoId' in obj;
        // 'isVisible' in obj &&
        // 'published' in obj;
}
