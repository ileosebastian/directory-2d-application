import { PlaceRepository } from "../domain/repos/place.repository";

import { UUID } from "../../shared/models/core.types";
import { AllDetailsPlace } from "../domain/place.domain";


export class GetAllDataPlaceUseCase {

    constructor(private readonly placeRepo: PlaceRepository) {}

    async run(placeId: UUID) {
        const place = await this.placeRepo.getPlaceById(placeId);
        const detailPlace = await this.placeRepo.getDetailPlaceById(place.uuid);

        if (place && detailPlace) {
            const allDetailPlace: AllDetailsPlace = {
                id: place.uuid,
                title: place.title || place.name + ' ' + place.code,
                code: place.code,
                category: place.category,
                campus: place.campus,
                faculty: place.faculty,
                belongsProfessor: detailPlace.belongsProfessor,
                professorsId: detailPlace.professorsId,
                wayPointId: place.wayPointId,
                floor: detailPlace.floor
            };

            return allDetailPlace;
        } else {
            throw new Error("Error to search place...");
        }
    }

}