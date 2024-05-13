import { KindOption } from "../../shared/models/core.types";
import { Block } from "./block.domain";
import { Sprite } from "./sprite.domain";


export interface Box {
    x: number;
    y: number;
    contain: Sprite | Block | null;
    type: 'place' | 'block' | 'ground';
    neighbors: Box[];
    kindOption: KindOption;
    isIgnored?: boolean;
}