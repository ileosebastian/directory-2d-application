import { UUID } from "src/app/core/shared/models/core.types";
import { DetailPlace, Place } from "../place.domain";


export interface PlaceRepository {
    getAllPlacesByFaculty(faculty: string): Promise<Place[]>;

    getAllPlaces(isByCampus: boolean, facultyOrCampusName: string, limit: number, loadMoreData: boolean, isReload: boolean): Promise<Place[]>;
    getPlacesByCategory(isByCampus: boolean, facultyOrCampusName: string, limit: number, category: string, loadMoreData: boolean, isReload: boolean): Promise<Place[]>;

    getPlacesByPlaneId(planeId: UUID): Promise<Place[]>;

    getAllPlacesByName(isCampus: boolean, facultyOrCampusName: string, name: string): Promise<Place[]>;
    getPlacesByName(isCampus: boolean, facultyOrCampusName: string, category: string, name: string): Promise<Place[]>;

    getPlaceById(id: UUID): Promise<Place>;
    getPlaceByOffice(office: string): Promise<Place>;

    getDetailPlaceById(id: UUID): Promise<DetailPlace>;
}