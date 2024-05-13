import { Injectable, inject } from "@angular/core";

import { FirestorePlaceRepository } from "./repositories/firestore-place.repository";

import { SearchPlacesUseCase } from "../application/search-places.usecase";
import { SearchPlacesByNameUseCase } from "../application/search-places-by-name.usecase";
import { GetAllDataPlaceUseCase } from "../application/get-all-data-place.usecase";
import { GetAllDataPlaceByOfficeUseCase } from "../application/get-all-data-place-by-office.usecase";
import { GetAllPlacesByFacultyUseCase } from "../application/get-all-places-by-faculty.usecase";

import { AllDetailsPlace } from "../domain/place.domain";
import { UUID } from "../../shared/models/core.types";
import { LIMIT_FOR_MOBILE, LIMIT_FOR_WEB_DESKTOP } from "../../shared/data/constants.data";

import { isAMobileDevice } from '../../shared/utils/is-a-mobile-device.util';
import { SqlitePlaceRepository } from "./repositories/sqlite-place.repository";


@Injectable({
    providedIn: 'root'
})
export class PlaceController {

    private readonly firestoreRepo = inject(FirestorePlaceRepository);
    private readonly sqliteRepo = inject(SqlitePlaceRepository);

    // Instances for online mode
    private readonly getPlacesByFacultyUCOnline: GetAllPlacesByFacultyUseCase;
    private readonly searchAllPlacesUCOnline: SearchPlacesUseCase;
    private readonly searchPlacesByNameUCOnline: SearchPlacesByNameUseCase;
    private readonly getAllDetailsPlaceUCOnline: GetAllDataPlaceUseCase;
    private readonly getAllDetailPlaceByOfficeUCOnline: GetAllDataPlaceByOfficeUseCase;
    // Instances for offline mode
    private readonly getPlacesByFacultyUCOffline: GetAllPlacesByFacultyUseCase;
    private readonly searchAllPlacesUCOffline: SearchPlacesUseCase;
    private readonly searchPlacesByNameUCOffline: SearchPlacesByNameUseCase;
    private readonly getAllDetailsPlaceUCOffline: GetAllDataPlaceUseCase;
    private readonly getAllDetailPlaceByOfficeUCOffline: GetAllDataPlaceByOfficeUseCase;

    constructor() {
        this.getPlacesByFacultyUCOnline = new GetAllPlacesByFacultyUseCase(this.firestoreRepo);
        this.searchAllPlacesUCOnline = new SearchPlacesUseCase(this.firestoreRepo);
        this.searchPlacesByNameUCOnline = new SearchPlacesByNameUseCase(this.firestoreRepo);
        this.getAllDetailsPlaceUCOnline = new GetAllDataPlaceUseCase(this.firestoreRepo);
        this.getAllDetailPlaceByOfficeUCOnline = new GetAllDataPlaceByOfficeUseCase(this.firestoreRepo);

        this.getPlacesByFacultyUCOffline = new GetAllPlacesByFacultyUseCase(this.sqliteRepo);
        this.searchAllPlacesUCOffline = new SearchPlacesUseCase(this.sqliteRepo);
        this.searchPlacesByNameUCOffline = new SearchPlacesByNameUseCase(this.sqliteRepo);
        this.getAllDetailsPlaceUCOffline = new GetAllDataPlaceUseCase(this.sqliteRepo);
        this.getAllDetailPlaceByOfficeUCOffline = new GetAllDataPlaceByOfficeUseCase(this.sqliteRepo);
    }

    async getTotalPlacesByFaculty(isOnlineMode: boolean, faculty: string) {
        return isOnlineMode ?
            await this.getPlacesByFacultyUCOnline.run(faculty) :
            await this.getPlacesByFacultyUCOffline.run(faculty);
    }

    async searchAllPlaces(
        isOnlineMode: boolean,
        criteria: string,
        value: string,
        category: string = '',
        loadMore: boolean = false,
        isReload: boolean = false
    ) {
        return isOnlineMode ?
            await this.searchAllPlacesUCOnline
                .run(
                    criteria,
                    value,
                    isAMobileDevice() ? LIMIT_FOR_MOBILE : LIMIT_FOR_WEB_DESKTOP,
                    category,
                    loadMore,
                    isReload
                ) :
            await this.searchAllPlacesUCOffline
                .run(
                    criteria,
                    value,
                    isAMobileDevice() ? LIMIT_FOR_MOBILE : LIMIT_FOR_WEB_DESKTOP,
                    category,
                    loadMore,
                    isReload
                );
    }

    async searchPlacesByName(
        isOnlineMode: boolean,
        criteria: string,
        value: string,
        category: string = '',
        name: string
    ) {
        return isOnlineMode ?
            await this.searchPlacesByNameUCOnline.run(criteria, value, category, name) :
            await this.searchPlacesByNameUCOffline.run(criteria, value, category, name);
    }

    async getAllDetailsPlaceById(isOnlineMode: boolean, id: UUID): Promise<AllDetailsPlace> {
        return isOnlineMode ?
            await this.getAllDetailsPlaceUCOnline.run(id) :
            await this.getAllDetailsPlaceUCOffline.run(id);
    }

    async getAllDetailsPlaceByOffice(isOnlineMode: boolean, office: string): Promise<AllDetailsPlace> {
        return isOnlineMode ?
            await this.getAllDetailPlaceByOfficeUCOnline.run(office) :
            await this.getAllDetailPlaceByOfficeUCOffline.run(office);
    }

}
