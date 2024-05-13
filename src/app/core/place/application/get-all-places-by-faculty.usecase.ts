import { PlaceRepository } from "../domain/repos/place.repository";

import { Place } from "../domain/place.domain";

import { getNameByCategory } from "../../shared/utils/get-name-by-category";


export class GetAllPlacesByFacultyUseCase {

    constructor(private readonly placeRepo: PlaceRepository) { }

    async run(faculty: string) {
        const places = await this.placeRepo.getAllPlacesByFaculty(faculty);

        const placesFiltered = places.filter(place => place.wayPointId !== 'X-X-X-X-X');

        const PLACES: { [key: string]: Place[] } = {};

        try {
            for (let i = 0; i < placesFiltered.length; i++) {
                const place = placesFiltered[i];
                const category = getNameByCategory(place.category);

                if (!PLACES[category]) {
                    PLACES[category] = [];
                }

                PLACES[category].push(place);
            }
        } catch (error) {
            console.error("=>>>", error);
        }

        return PLACES;
    }

}