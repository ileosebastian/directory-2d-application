import { Place } from "../../place/domain/place.domain";

export const isAPlace = (obj: any): obj is Place => {
    return 'uuid' in obj &&
        'name' in obj &&
        'title' in obj &&
        'category' in obj &&
        'code' in obj &&
        'campus' in obj &&
        'faculty' in obj &&
        'planeId' in obj &&
        'wayPointId' in obj;
    // return 'id' in obj &&
    // 'published' in obj;
}