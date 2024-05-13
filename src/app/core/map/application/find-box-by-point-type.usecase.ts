import { Plane } from "../domain/plane.domain";

import { WaypointType } from "../../shared/models/core.types";

import { isAWaypoint } from "../../shared/utils/is-a-waypoint.util";


export class FindBoxByPointTypeUseCase {

    constructor() { }

    run(floor: number, type: WaypointType, PLANS: { [key: number]: Plane }) {
        const box = PLANS[floor].stage
            .find(col =>
                col.find(row => row.contain &&
                    isAWaypoint(row.contain) &&
                    row.contain.pointType === type
                )
            )?.find(box => box.contain &&
                isAWaypoint(box.contain) &&
                box.contain.pointType === type
            );
        if (box)
            return box;
        else
            throw new Error(`Error finding ${type} waypoint box in buildings`);
    }

}