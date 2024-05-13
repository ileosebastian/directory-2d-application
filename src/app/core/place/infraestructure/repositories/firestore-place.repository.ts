import { Injectable, inject } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, collection } from '@angular/fire/firestore';
import { firstValueFrom, map } from 'rxjs';

import { PlaceRepository } from '../../domain/repos/place.repository';

import { DetailPlace, Place } from '../../domain/place.domain';
import { executeQuery } from '../../../shared/utils/execute-firestore-query.utils';
import { Constrains, PlacesByFacultyAndCategoryAndPage } from '../../../shared/models/core.interfaces';
import { KeyPlacePagination, UUID } from '../../../shared/models/core.types';


@Injectable({
    providedIn: 'root'
})
export class FirestorePlaceRepository implements PlaceRepository {

    private placeCollection!: CollectionReference<DocumentData>;
    private placeDetailsCollection!: CollectionReference<DocumentData>;

    private pagination: PlacesByFacultyAndCategoryAndPage = {};

    private readonly db = inject(Firestore);

    private ruleConstrain: Constrains = {
        type: 'where',
        filter: '==',
        field: 'published',
        value: true
    };

    constructor() {
        this.placeCollection = collection(this.db, "places");
        this.placeDetailsCollection = collection(this.db, "place-details");
    }

    async getAllPlacesByFaculty(faculty: string): Promise<Place[]> {
        const constrains: Constrains[] = [
            {
                type: 'where',
                field: 'faculty',
                filter: '==',
                value: faculty
            },
            {
                type: 'orderBy',
                field: 'title',
            }
        ];

        const obs = executeQuery<Place>(this.placeCollection, [...constrains, this.ruleConstrain]);

        return await firstValueFrom(obs);
    }

    async getPlacesByPlaneId(planeId: UUID): Promise<Place[]> {
        const constrains: Constrains[] = [
            {
                type: 'where',
                field: 'planeId',
                filter: '==',
                value: planeId
            }
        ];

        const obs = executeQuery<Place>(this.placeCollection, [...constrains, this.ruleConstrain]);

        return await firstValueFrom(obs);
    }

    async getAllPlaces(isByCampus: boolean, facultyOrCampusName: string, limit: number, loadMoreData: boolean, isReload: boolean): Promise<Place[]> {
        if (isReload) {
            this.pagination = {};
        }

        return await this.getPlacesByCategoryController(isByCampus ? 'campus' : 'faculty', facultyOrCampusName, limit, null, loadMoreData);
    }

    async getPlacesByCategory(isByCampus: boolean, facultyOrCampusName: string, limit: number, category: string, loadMoreData: boolean, isReload: boolean): Promise<Place[]> {
        if (isReload) {
            this.pagination = {};
        }

        return await this.getPlacesByCategoryController(isByCampus ? 'campus' : 'faculty', facultyOrCampusName, limit, category, loadMoreData);
    }

    private async getPlacesByCategoryController(criteria: string, value: string, limit: number, category: string | null, loadMore: boolean = false) {
        if (loadMore) {
            return this.queryToPromise(criteria, value, limit, category);
        }

        const currentKey: KeyPlacePagination = `${value}-${category ?? 'places'}`;
        if (this.pagination[currentKey]) {
            return this.pagination[currentKey].places;
        }

        return await this.queryToPromise(criteria, value, limit, category);
    }

    private async queryToPromise(criteria: string, value: string, limit: number, category: string | null) {
        const currentKey: KeyPlacePagination = `${value}-${category ?? 'places'}`;

        if (Object.keys(this.pagination).includes(currentKey)) {
        } else {// new pagination
            this.pagination[currentKey] = {
                lastValue: null,
                places: []
            }
        }

        let val: Place | null = null;
        const lastValue = this.pagination[currentKey].lastValue;

        if (lastValue) {
            if (typeof lastValue !== 'number') {
                val = lastValue;
            } else {
                val = null;
            }
        }

        const constrains: Constrains[] = [
            {
                type: 'where',
                field: criteria,
                filter: '==',
                value: value
            },
            {
                type: 'limit',
                value: limit
            },
        ];

        if (category === 'profe-office' || category === 'admin-office' || category === 'classroom') {
            constrains.push(
                {
                    type: 'orderBy',
                    field: 'code',
                },
                {
                    type: 'orderBy',
                    field: 'name',
                },
                {
                    type: 'startAfter',
                    value: val ? val.code : null // important to search alfabethically
                },
            );
        } else { // all places
            constrains.push(
                {
                    type: 'orderBy',
                    field: 'title',
                },
                {
                    type: 'startAfter',
                    value: val ? val?.title : null
                },
            );
        }

        if (category) {
            // Why would I be interested in the stairs that are shown and are the intermediaries to go to the next floor (stair-horizontal)?
            if (category === 'stair') category = 'stair-vertical';
            constrains.push(
                {
                    type: 'where',
                    field: 'category',
                    filter: '==',
                    value: category
                },
            );
        }

        const obs = executeQuery<Place>(
            this.placeCollection, [...constrains, this.ruleConstrain]
        );

        return await firstValueFrom(obs)
            .then(places => {
                if (places.length === 0) {
                    return this.pagination[currentKey].places;
                }

                const ALL_KEYS = Object.keys(this.pagination);
                ALL_KEYS.forEach(key => {
                    if (key === currentKey) {
                        this.pagination[currentKey] = {
                            lastValue: places[places.length - 1],
                            places: [...this.pagination[currentKey].places, ...places]
                        };
                    } else {
                        const places = this.pagination[key as KeyPlacePagination].places.slice(0, limit);
                        this.pagination[key as KeyPlacePagination] = {
                            lastValue: places[places.length - 1],
                            places
                        };
                    }
                });

                return this.pagination[currentKey].places;
            })
            .catch(error => {
                console.error(error);
                return this.pagination[currentKey].places;
            });
    }

    async getAllPlacesByName(isCampus: boolean, facultyOrCampusName: string, name: string): Promise<Place[]> {
        const constrains: Constrains[] = [
            {
                type: 'where',
                field: isCampus ? 'campus' : 'faculty',
                filter: '==',
                value: facultyOrCampusName
            },
            {
                type: 'orderBy',
                field: 'name',
            }
        ];

        const obs = executeQuery<Place>(this.placeCollection, [...constrains, this.ruleConstrain])
            .pipe(
                map(places => places.filter(place => place.title?.toLowerCase().includes(name))),
            );

        return await firstValueFrom(obs);
    }

    async getPlacesByName(isCampus: boolean, facultyOrCampusName: string, category: string, name: string): Promise<Place[]> {
        const constrains: Constrains[] = [
            {
                type: 'where',
                field: isCampus ? 'campus' : 'faculty',
                filter: '==',
                value: facultyOrCampusName
            },
            {
                type: 'where',
                field: 'category',
                filter: '==',
                value: category
            },
            {
                type: 'orderBy',
                field: 'name',
            }
        ];

        const obs = executeQuery<Place>(this.placeCollection, [...constrains, this.ruleConstrain])
            .pipe(
                map(places => places.filter(place => place.title?.toLowerCase().includes(name))),
            );

        return await firstValueFrom(obs);
    }

    async getPlaceByOffice(office: string): Promise<Place> {
        const constrains: Constrains[] = [
            {
                type: 'where',
                field: 'code',
                filter: '==',
                value: office
            },
            {
                type: 'limit',
                value: 1
            }
        ];

        const obs = executeQuery<Place>(this.placeCollection, [...constrains, this.ruleConstrain]);

        const places = await firstValueFrom(obs);

        const place = places.pop();

        if (place) return place;

        throw new Error(`Error finding place by code: ${office}`);
    }

    async getPlaceById(id: UUID): Promise<Place> {
        const constrains: Constrains[] = [
            {
                type: 'where',
                field: 'uuid',
                filter: '==',
                value: id
            },
            {
                type: 'limit',
                value: 1
            }
        ];

        const obs = executeQuery<Place>(this.placeCollection, [...constrains, this.ruleConstrain]);

        const places = await firstValueFrom(obs);

        const place = places.pop();

        if (place) return place;

        throw new Error(`Error finding place data by id: ${id}`);
    }

    async getDetailPlaceById(id: UUID): Promise<DetailPlace> {
        const constrains: Constrains[] = [
            {
                type: 'where',
                field: 'placeId',
                filter: '==',
                value: id
            },
            {
                type: 'limit',
                value: 1
            }
        ];

        const obs = executeQuery<DetailPlace>(this.placeDetailsCollection, [...constrains, this.ruleConstrain]);

        const details = await firstValueFrom(obs);

        const detail = details.pop();

        if (detail) return detail;

        throw new Error(`Error to found detail place data by id: ${id}`);
    }

}