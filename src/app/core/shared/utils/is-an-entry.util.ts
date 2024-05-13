import { Entry } from "../../map/domain/entry.domain";

export const isAnEntry = (obj: any): obj is Entry => {
    return 'title' in obj && 'waypointId' in obj && 'category' in obj;
}