import { Entry } from "../../../core/map/domain/entry.domain";
import { AllDetailsPlace, Place } from "../../../core/place/domain/place.domain";
import { UUID } from "../../../core/shared/models/core.types";


export interface Tour {
    startId: UUID | null;
    goalId: UUID;
    origin: Entry | Place;
    destiny: AllDetailsPlace;
}