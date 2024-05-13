import { Injectable, inject } from "@angular/core";

import { PlaceRepository } from "../../domain/repos/place.repository";

import { AppDatabaseService } from "src/app/core/SQLiteStore/services/app-database.service";

import { Place, DetailPlace } from "../../domain/place.domain";
import { KeyPlacePagination, UUID } from "../../../shared/models/core.types";
import { SqliteOfflineService } from "src/app/core/SQLiteStore/services/sqlite-offline.service";
import { PlacesByFacultyAndCategoryAndPage } from "src/app/core/shared/models/core.interfaces";


@Injectable({
    providedIn: 'root'
})
export class SqlitePlaceRepository implements PlaceRepository {

    private readonly _sqlite = inject(SqliteOfflineService);
    private readonly appDatabaseSrvc = inject(AppDatabaseService);

    private pagination: PlacesByFacultyAndCategoryAndPage = {};

    constructor() { }

    async getAllPlacesByFaculty(faculty: string): Promise<Place[]> {
        const { idx, typeParam } = this.getParameters('faculty');

        const stmt = `
            SELECT * FROM place
            INDEXED BY ${idx}
            WHERE ${typeParam} == ?
            ORDER BY title ASC;
        `;

        return await this._sqlite.query<Place>(this.appDatabaseSrvc.getDB_NAME(), stmt, [faculty]);
    }

    async getAllPlaces(isByCampus: boolean, facultyOrCampusName: string, limit: number, loadMoreData: boolean, isReload: boolean): Promise<Place[]> {
        if (isReload) {
            this.pagination = {};
        }

        if (loadMoreData) {
            return await this.getPlacesController(isByCampus, facultyOrCampusName, limit);
        }

        const currentKey: KeyPlacePagination = `${facultyOrCampusName}-${'places'}`;
        if (this.pagination[currentKey]) {
            return this.pagination[currentKey].places;
        }

        return await this.getPlacesController(isByCampus, facultyOrCampusName, limit);
    }

    async getPlacesByCategory(isByCampus: boolean, facultyOrCampusName: string, limit: number, category: string, loadMoreData: boolean, isReload: boolean): Promise<Place[]> {
        if (isReload) {
            this.pagination = {};
        }

        if (loadMoreData) {
            return await this.getPlacesController(isByCampus, facultyOrCampusName, limit, category);
        }

        const currentKey: KeyPlacePagination = `${facultyOrCampusName}-${category}`;
        if (this.pagination[currentKey]) {
            return this.pagination[currentKey].places;
        }

        return await this.getPlacesController(isByCampus, facultyOrCampusName, limit, category);
    }

    private async getPlacesController(isCampus: boolean, value: string, limit: number, category?: string) {
        const currentKey: KeyPlacePagination = `${value}-${category ?? 'places'}`;

        if (!Object.keys(this.pagination).includes(currentKey)) {
            this.pagination[currentKey] = {
                places: [],
                lastValue: 0
            }
        }

        const { idx, typeParam } = category ?
            this.getParameters(isCampus ? 'campus-category' : 'faculty-category') :
            this.getParameters(isCampus ? 'campus' : 'faculty');

        if (category && category.includes('stair')) category = 'stair-vertical';

        const indexFilter = category ?
            `
                INDEXED BY ${idx}
                WHERE ${typeParam[0]} == ? AND ${typeParam[1]} == ?   
            ` :
            `
                INDEXED BY ${idx}
                WHERE ${typeParam} == ?
            `;

        let offset: number = 0;
        const lastValue = this.pagination[currentKey].lastValue;
        if (lastValue) {
            if (typeof lastValue === 'number') {
                offset = lastValue;
            }
        }

        const stmt = `
            SELECT * FROM place
            ${indexFilter} 
            ORDER BY title ASC
            LIMIT ? OFFSET ?;
        `;

        const places = category ?
            await this._sqlite.query<Place>(this.appDatabaseSrvc.getDB_NAME(), stmt, [value, category, limit, offset]) :
            await this._sqlite.query<Place>(this.appDatabaseSrvc.getDB_NAME(), stmt, [value, limit, offset]);

        offset = offset + limit;

        if (places.length === 0) {
            return this.pagination[currentKey].places;
        }

        const ALL_KEYS = Object.keys(this.pagination);
        ALL_KEYS.forEach(key => {
            if (key === currentKey) {
                this.pagination[currentKey] = {
                    lastValue: offset,
                    places: [...this.pagination[currentKey].places, ...places]
                };
            } else {
                const places = this.pagination[key as KeyPlacePagination].places.slice(0, limit);
                this.pagination[key as KeyPlacePagination] = {
                    lastValue: limit,
                    places
                };
            }
        });

        return this.pagination[currentKey].places;
    }

    async getPlacesByPlaneId(planeId: UUID): Promise<Place[]> {
        const stmt = `
            SELECT * FROM place
            WHERE planeId == ?; 
        `;

        return await this._sqlite.query<Place>(this.appDatabaseSrvc.getDB_NAME(), stmt, [planeId]);
    }

    async getAllPlacesByName(isCampus: boolean, facultyOrCampusName: string, name: string): Promise<Place[]> {
        const { idx, typeParam } = this.getParameters(isCampus ? 'campus' : 'faculty');

        const stmt = `
            SELECT * FROM place
            INDEXED BY ${idx}
            WHERE ${typeParam} == ?
            AND title LIKE ?
            ORDER BY title ASC;
        `;

        return await this._sqlite.query<Place>(this.appDatabaseSrvc.getDB_NAME(), stmt, [facultyOrCampusName, `%${name.toLowerCase()}%`]);
    }

    async getPlacesByName(isCampus: boolean, facultyOrCampusName: string, category: string, name: string): Promise<Place[]> {
        const { idx, typeParam } = this.getParameters(isCampus ? 'campus-category' : 'faculty-category');

        const stmt = `
            SELECT * FROM place
            INDEXED BY ${idx}
            WHERE ${typeParam[0]} == ? AND ${typeParam[1]} == ?
            AND title LIKE ?
            ORDER BY title ASC;
        `;

        return await this._sqlite.query<Place>(this.appDatabaseSrvc.getDB_NAME(), stmt, [facultyOrCampusName, category, `%${name.toLowerCase()}%`]);
    }

    async getPlaceById(id: UUID): Promise<Place> {
        const stmt = `
            SELECT * FROM place
            WHERE uuid == ?
            LIMIT 1;
        `;
        const places = await this._sqlite.query<Place>(this.appDatabaseSrvc.getDB_NAME(), stmt, [id]);

        const place = places.pop();

        if (place) {
            return place;
        }

        throw new Error(`Error finding place data by id: ${id}`);
    }

    async getPlaceByOffice(office: string): Promise<Place> {
        const stmt = `
            SELECT * FROM place
            WHERE code == ?
            LIMIT 1;
        `;
        const places = await this._sqlite.query<Place>(this.appDatabaseSrvc.getDB_NAME(), stmt, [office]);

        const place = places.pop();

        if (place) {
            return place;
        }

        throw new Error(`Error finding place data by code: ${office}`);
    }

    async getDetailPlaceById(id: UUID): Promise<DetailPlace> {
        const stmt = `
            SELECT * FROM place_detail
            WHERE placeId == ?
            LIMIT 1;
        `;
        const detailPlaces = await this._sqlite.query<any>(this.appDatabaseSrvc.getDB_NAME(), stmt, [id]);

        const dp = detailPlaces.pop();

        if (dp) {
            const detailPlace: DetailPlace = {
                placeId: dp.placeId,
                floor: dp.floor,
                belongsProfessor: dp.belongsProfessor ? true : false, // 0 is false in JIT compiler's js
                professorsId: dp.professorsId.split(',')
            };

            return detailPlace;
        }

        throw new Error(`Error to found detail place data by id: ${id}`);
    }

    private getParameters(param: 'campus' | 'faculty' | 'campus-category' | 'faculty-category') {
        switch (param) {
            case 'campus': return { idx: 'idx_place_campus', typeParam: 'campus' };
            case 'faculty': return { idx: 'idx_place_faculty', typeParam: 'faculty' };
            case 'campus-category': return { idx: 'idx_place_campus_category', typeParam: ['campus', 'category'] };
            case 'faculty-category': return { idx: 'idx_place_faculty_category', typeParam: ['faculty', 'category'] };
        };
    }

}
