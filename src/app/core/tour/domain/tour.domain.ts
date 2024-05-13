import { Plane } from "../../map/domain/plane.domain";
import { Box } from "./box.domain";

export interface Blueprint {
    start: Box,
    goal: Box,
    path: Box[],
    plane: Plane
}
