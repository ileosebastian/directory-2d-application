import { Entry } from "../domain/entry.domain";
import { Plane } from "../domain/plane.domain";

import { isAWaypoint } from "../../shared/utils/is-a-waypoint.util";
import { WaypointType } from "../../shared/models/core.types";
import { ENTRY_FIRST_FLOOR_TITLE } from "../../shared/data/constants.data";


export class GetEntryBuildingByPlansUseCase {

    private readonly validEntryWaypoints: WaypointType[] = ['origin_first_floor', 'origin_next_floor'];

    constructor() { }

    run(PLANS: Plane[]) {
        const ENTRIES: Entry[] = [];

        const result = PLANS
            .sort((a, b) => a.floor - b.floor)
            .map(plane => {
                return plane.stage
                    .reduce((acc, item) => acc.concat(item), [])
                    .filter(row =>
                        row.contain &&
                        isAWaypoint(row.contain) &&
                        this.validEntryWaypoints.includes(row.contain.pointType)
                    )[0]
            })

        result.forEach((res, index) => {
            if (res.contain && isAWaypoint(res.contain)) {
                ENTRIES.push({
                    category: 'layers',
                    title: index === 0 ? ENTRY_FIRST_FLOOR_TITLE : 'Piso ' + (index),
                    waypointId: res.contain.uuid
                });
            }
        });

        return ENTRIES;
    }

}