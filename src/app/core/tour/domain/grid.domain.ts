import { Box } from "./box.domain";

export interface Grid {
    columns: number;
    rows: number;

    widthTiles: number;
    heightTiles: number;

    stage: Box[][];
}