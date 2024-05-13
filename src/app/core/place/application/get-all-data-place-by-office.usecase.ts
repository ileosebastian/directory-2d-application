import { PlaceRepository } from "../domain/repos/place.repository";

import { AllDetailsPlace } from "../domain/place.domain";


export class GetAllDataPlaceByOfficeUseCase {

    constructor(private readonly placeRepo: PlaceRepository) { }

    async run(office: string) {
        const place = await this.placeRepo.getPlaceByOffice(office);
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