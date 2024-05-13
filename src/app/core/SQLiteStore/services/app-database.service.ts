import { Injectable, inject } from "@angular/core";

import { JsonSQLite } from "@capacitor-community/sqlite";

import { SqliteOfflineService } from "./sqlite-offline.service";

import { Faculty } from "../../university/domain/faculty.domain";
import { DetailProfessor, Professor } from "../../professor/domain/professor.domain";
import { Building } from "../../map/domain/building.domain";
import { PlaneParsed } from "../../map/domain/plane.domain";
import { DetailPlace, Place } from '../../place/domain/place.domain';
import { DATABASES } from "../schemas/databases";

import { AvaliableDatabases, CampusPermitted } from "../../shared/models/core.types";
import { SetStatement } from "../../shared/models/core.interfaces";
import { BUILDING_INSTALLATION_STATEMENT, DETAIL_PLACE_INSTALLATION_STATEMENT, DETAIL_PROFESSOR_INSTALLATION_STATEMENT, FACULTY_INSTALLATION_STATEMENT, PLACE_INSTALLATION_STATEMENT, PLANE_INSTALLATION_STATEMENT, PROFESSOR_INSTALLATION_STATEMENT } from "../../shared/statements/installation.statements";


interface AppData {
    faculties: Faculty[];
    buildings: Building[];
    plans: PlaneParsed[];
    professors: { professor: Professor, detailProfessor: DetailProfessor }[];
    places: { place: Place, detailPlace: DetailPlace }[];
}


@Injectable({
    providedIn: 'root'
})
export class AppDatabaseService {

    private readonly DB_NAME: AvaliableDatabases;
    private readonly DATABASE: JsonSQLite;

    private readonly _sqlite = inject(SqliteOfflineService);

    constructor() {
        this.DB_NAME = 'directory.db';
        this.DATABASE = DATABASES['directory.db'];
    }

    getDB_NAME(): AvaliableDatabases {
        return this.DB_NAME;
    }

    async initializeDatabase() {
        await this._sqlite.setupSchemas(this.DATABASE);

        await this._sqlite
            .openDatabase(
                this.DB_NAME,
                this.DATABASE.encrypted,
                'no-encryption',
                this.DATABASE.version,
                false
            );
    }

    private async generateDeletionStatements(campus: CampusPermitted) {
        const set: SetStatement[] = [];

        let stmt = `
            SELECT * FROM professor
            INDEXED BY idx_professor_campus
            WHERE campus == '${campus}';
        `;
        const professors = await this._sqlite.query<Professor>(this.DB_NAME, stmt, []);

        for (const professor of professors) {
            set.push({
                statement: `DELETE FROM professor_detail WHERE uuid == ?;`,
                values: [professor.infoId]
            });
        }

        stmt = `
            SELECT * FROM place 
            INDEXED BY idx_place_campus
            WHERE campus == '${campus}';
        `;
        const places = await this._sqlite.query<Place>(this.DB_NAME, stmt, []);

        for (const place of places) {
            set.push({
                statement: `DELETE FROM place_detail WHERE placeId == ?;`,
                values: [place.uuid]
            });
        }

        stmt = `
            SELECT * FROM building
            INDEXED BY idx_building_campus
            WHERE campus == '${campus}';
        `;
        const buildings = await this._sqlite.query<Building>(this.DB_NAME, stmt, []);

        for (const building of buildings) {
            set.push({
                statement: `DELETE FROM plane WHERE buildingId == ?;`,
                values: [building.uuid]
            });
        }

        const tablesWithCampusColumn = ['faculty', 'building', 'place', 'professor'];
        for (const tableName of tablesWithCampusColumn) {
            set.push({
                statement: `
                    DELETE FROM ${tableName} 
                    INDEXED BY idx_${tableName}_campus
                    WHERE campus == ?;`,
                values: [campus]
            });
        }

        return set;
    }

    async saveAllAppDataByCampus(campusName: CampusPermitted, appData: AppData) {

        const set: SetStatement[] = [];

        for (const facu of appData.faculties) {
            const { campus, name } = facu;
            set.push({
                statement: FACULTY_INSTALLATION_STATEMENT,
                values: [campus, name]
            });
        }

        for (const building of appData.buildings) {
            const { uuid, campus, faculty, floors, name } = building;
            set.push({
                statement: BUILDING_INSTALLATION_STATEMENT,
                values: [uuid, campus, faculty, floors, name]
            });
        }

        for (const plane of appData.plans) {
            const { uuid, columns, rows, widthTiles, heightTiles, stage, floor, waypoints, buildingId } = plane;
            set.push({
                statement: PLANE_INSTALLATION_STATEMENT,
                values: [uuid, columns, rows, widthTiles, heightTiles, stage, floor, waypoints, buildingId]
            });
        }

        for (const { place, detailPlace } of appData.places) {
            const { uuid, name, code, title, category, campus, faculty, wayPointId, planeId } = place;
            const { placeId, floor, belongsProfessor, professorsId } = detailPlace;

            set.push({
                statement: PLACE_INSTALLATION_STATEMENT,
                values: [uuid, name, code, title, category, campus, faculty, wayPointId, planeId]
            });

            set.push({
                statement: DETAIL_PLACE_INSTALLATION_STATEMENT,
                values: [placeId, floor, belongsProfessor ? 1 : 0, professorsId.toString()]
            });
        }

        for (const { professor, detailProfessor } of appData.professors) {
            const { uuid, category, dedication, email, schedule } = detailProfessor;
            const { id, name, campus, faculty, department, office, infoId } = professor;

            set.push({
                statement: DETAIL_PROFESSOR_INSTALLATION_STATEMENT,
                values: [uuid, category, dedication, email, JSON.stringify(schedule)]
            });

            set.push({
                statement: PROFESSOR_INSTALLATION_STATEMENT,
                values: [id, name, campus, faculty, department, office || '', infoId]
            });
        }

        await this._sqlite.executeSet(this.DB_NAME, set, true);

    }

    async deleteAllDataByCampus(campus: CampusPermitted) {

        const set = await this.generateDeletionStatements(campus);
        await this._sqlite.executeSet(this.DB_NAME, set, true);

    }

    async deleteAllData() {
        const set: SetStatement[] = [];
        for (const tableName of ['faculty', 'building', 'plane', 'place', 'place_detail', 'professor', 'professor_detail']) {
            set.push({
                statement: `DELETE FROM ${tableName};`,
                values: []
            });
        }
        await this._sqlite.executeSet(this.DB_NAME, set, true);
    }

    async terminateDatabase() {
        await this._sqlite.closeConnection(this.DB_NAME);
    }

}
