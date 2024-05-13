import { Block } from "../../tour/domain/block.domain";

export const isABlock = (obj: any): obj is Block => {
    return 'color' in obj && 'blockType' in obj;
}