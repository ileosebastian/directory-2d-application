import { Waypoint } from "../../tour/domain/waypoint.domain";

export const isAWaypoint = (obj: any): obj is Waypoint => {
    return 'name' in obj && 
            'pointType' in obj && 
            // 'isDetinyGoal' in obj && 
            'uuid' in obj;
}