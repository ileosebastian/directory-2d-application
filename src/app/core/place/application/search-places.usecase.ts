import { Place } from "../domain/place.domain";
import { PlaceRepository } from "../domain/repos/place.repository";


export class SearchPlacesUseCase {

    constructor(private readonly placeRepo: PlaceRepository) {}

    async run(criteria: string, value: string, limit: number, category: string = '', loadMoreData: boolean, isReload: boolean) {
        let places: Place[];
        if (category === 'places') {
            places = await this.placeRepo.getAllPlaces(criteria === 'todos', value, limit, loadMoreData, isReload);
        } else {
            places = await this.placeRepo.getPlacesByCategory(criteria === 'todos', value, limit, category, loadMoreData, isReload);
        }
        places = places.filter(place => place.wayPointId !== 'X-X-X-X-X');
        return places;
    }

}