import { PlaceRepository } from "../domain/repos/place.repository";

import { ALL_FACULTIES_KEY, PLACE_SEARCH_KEY } from "../../shared/data/constants.data";
import { Place } from "../domain/place.domain";


export class SearchPlacesByNameUseCase {

    constructor(private readonly placeRepo: PlaceRepository) { }

    async run(criteria: string, value: string, category: string = '', name: string) {
        let places: Place[];
        if (category === PLACE_SEARCH_KEY) {
            places = await this.placeRepo.getAllPlacesByName(criteria === ALL_FACULTIES_KEY, value, name);
        } else {
            places = await this.placeRepo.getPlacesByName(criteria === ALL_FACULTIES_KEY, value, category, name);
        }

        places = places.filter(place => place.wayPointId !== 'X-X-X-X-X');
        return places;
    }

}