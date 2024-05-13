import { Injectable, inject } from "@angular/core";

import { MapRepository } from "../../domain/repos/map.repository";

import { SqliteOfflineService } from "src/app/core/SQLiteStore/services/sqlite-offline.service";
import { AppDatabaseService } from "src/app/core/SQLiteStore/services/app-database.service";

import { Building } from "../../domain/building.domain";
import { PlaneParsed } from "../../domain/plane.domain";
import { UUID } from "../../../shared/models/core.types";


@Injectable({
    providedIn: 'root'
})
export class SqliteMapRepository implements MapRepository {

    private readonly _sqlite = inject(SqliteOfflineService);
    private readonly appDatabaseSrvc = inject(AppDatabaseService);

    constructor() { }

    async getBuildingByFaculty(facultyName: string): Promise<Building> {
        const stmt = `
            SELECT * FROM building
            INDEXED By idx_building_faculty
            WHERE faculty == ?
            LIMIT 1;
        `;

        const buildings = await this._sqlite.query<Building>(this.appDatabaseSrvc.getDB_NAME(), stmt, [facultyName]);

        const building = buildings.pop();

        if (building) {
            return building;
        }

        throw new Error(`Error finding building by ${facultyName} faculty.`);
    }

    async getPlansByBuildingId(buildingId: UUID, limitOfFloors: number): Promise<PlaneParsed[]> {
        const stmt = `
            SELECT * FROM plane
            WHERE buildingId == ?
            LIMIT ?;
        `;

        return await this._sqlite.query<PlaneParsed>(this.appDatabaseSrvc.getDB_NAME(), stmt, [buildingId, limitOfFloors]);
    }

}
