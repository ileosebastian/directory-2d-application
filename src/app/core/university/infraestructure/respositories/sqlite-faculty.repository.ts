import { Injectable, inject } from "@angular/core";

import { FacultyRepository } from "../../domain/repos/faculty.repository";

import { AppDatabaseService } from "src/app/core/SQLiteStore/services/app-database.service";
import { SqliteOfflineService } from "src/app/core/SQLiteStore/services/sqlite-offline.service";

import { Faculty } from "../../domain/faculty.domain";


@Injectable({
    providedIn: 'root'
})
export class SqliteFacultyRepository implements FacultyRepository {

    private readonly _sqlite = inject(SqliteOfflineService);
    private readonly appDatabaseSrvc = inject(AppDatabaseService);

    constructor() { }

    async getAllFaculties(): Promise<Faculty[]> {
        const statement = `SELECT * FROM faculty;`;

        const faculties = await this._sqlite.query<Faculty>(this.appDatabaseSrvc.getDB_NAME(), statement, []);

        return faculties;
    }

    async getAllFacultiesByCampus(campusName: string): Promise<Faculty[]> {
        const statement = `SELECT * FROM faculty INDEXED BY idx_faculty_campus WHERE campus == ?;`;

        const faculties = await this._sqlite.query<Faculty>(this.appDatabaseSrvc.getDB_NAME(), statement, [campusName]);

        return faculties;
    }

}
