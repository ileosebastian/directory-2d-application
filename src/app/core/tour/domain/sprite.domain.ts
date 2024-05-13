import { UUID } from "../../shared/models/core.types";

export interface SpriteInMemory {
    category: string;
    path: string;
}

export interface Sprite {
    placeId: UUID;
    source: string;
    width: number;
    height: number;
    spriteType: string; // any category for places
    label?: string;
}