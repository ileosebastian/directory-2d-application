import { Plane } from "../domain/plane.domain";

import { UUID } from "../../shared/models/core.types";

import { isAWaypoint } from "../../shared/utils/is-a-waypoint.util";


export class GetBoxAndPlaneByWaypointIdUseCase {

    constructor() { }

    run(waypointID: UUID, PLANS: Plane[]) {
        const result = PLANS
            .map(plane => {
                if (plane.wayPoints.filter(wp => wp.uuid === waypointID).length > 0)
                    return {
                        box: plane.stage
                            .reduce((acc, item) => acc.concat(item), [])
                            .filter(row =>
                                row.contain &&
                                isAWaypoint(row.contain) &&
                                row.contain.uuid === waypointID
                            )[0],
                        plane
                    };
                else
                    return -1;
            })
            .filter(item => item !== -1)[0];

        if (result && result !== -1) {
            return result;
        } else
            throw new Error(`Error finding box and plane linked by ID: ${waypointID}`);
    }

}