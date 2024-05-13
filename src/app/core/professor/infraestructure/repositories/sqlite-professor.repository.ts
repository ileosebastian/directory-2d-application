import { Injectable, inject } from "@angular/core";

import { ProfessorRepository } from "../../domain/repos/professor.repository";

import { Professor, DetailProfessor } from "../../domain/professor.domain";
import { SqliteOfflineService } from "src/app/core/SQLiteStore/services/sqlite-offline.service";
import { AppDatabaseService } from "src/app/core/SQLiteStore/services/app-database.service";
import { ProfessorsByFacultyAndPage } from "src/app/core/shared/models/core.interfaces";


@Injectable({
    providedIn: 'root'
})
export class SqliteProfessorRepository implements ProfessorRepository {

    private readonly _sqlite = inject(SqliteOfflineService);
    private readonly appDatabaseSrvc = inject(AppDatabaseService);

    private pagination: ProfessorsByFacultyAndPage = {};

    constructor() { }

    async getAllProfessors(isByCampus: boolean, facultyOrCampusName: string, limit: number, loadMoreData: boolean, isReload: boolean): Promise<Professor[]> {
        if (isReload) {
            this.pagination = {};
        }

        if (loadMoreData) {
            return await this.getProfessorsController(isByCampus, facultyOrCampusName, limit);
        }

        if (this.pagination[facultyOrCampusName]) {
            return this.pagination[facultyOrCampusName].professors;
        }

        return await this.getProfessorsController(isByCampus, facultyOrCampusName, limit);
    }

    private async getProfessorsController(isByCampus: boolean, value: string, limit: number) {

        if (!(Object.keys(this.pagination).includes(value))) {
            this.pagination[value] = {
                professors: [],
                lastValue: 0
            };
        }

        let offset: number = 0;
        const lastValue = this.pagination[value].lastValue;
        if (lastValue) {
            if (typeof lastValue === 'number') {
                offset = lastValue;
            }
        }

        const { idx, typeParam } = this.getParameters(isByCampus);
        const stmt = `SELECT * FROM professor
            INDEXED BY ${idx}
            WHERE ${typeParam} == ?
            ORDER BY name ASC
            LIMIT ? OFFSET ?;`;


        const professors = await this._sqlite.query<Professor>(this.appDatabaseSrvc.getDB_NAME(), stmt, [value, limit, offset]);

        offset = offset + limit;

        if (professors.length === 0) {
            return this.pagination[value].professors;
        }

        // for best performance to reduce rendering amount
        const ALL_KEYS = Object.keys(this.pagination);
        ALL_KEYS.forEach(key => {
            if (key === value) {
                this.pagination[value] = {
                    lastValue: offset,
                    professors: [...this.pagination[value].professors, ...professors]
                };
            } else {
                const profes = this.pagination[key].professors.slice(0, limit);
                this.pagination[key] = {
                    lastValue: limit,
                    professors: profes
                }
            }
        });

        return this.pagination[value].professors;

    }

    async getProfessorsByName(isCampus: boolean, facultyOrCampusName: string, name: string): Promise<Professor[]> {
        const { idx, typeParam } = this.getParameters(isCampus);

        const stmt = `SELECT * FROM professor
            INDEXED BY ${idx}
            WHERE ${typeParam} == ?
            AND name LIKE ?
            ORDER BY name ASC;`;

        return await this._sqlite.query<Professor>(this.appDatabaseSrvc.getDB_NAME(), stmt, [facultyOrCampusName, `%${name.toLowerCase()}%`]);
    }

    async getProfessorById(id: string): Promise<Professor> {
        const stmt = `SELECT * FROM professor WHERE id == ? LIMIT 1;`;

        const profes = await this._sqlite.query<Professor>(this.appDatabaseSrvc.getDB_NAME(), stmt, [id]);

        const professor = profes.pop();

        if (professor) {
            return professor;
        }

        throw new Error(`Error to get professor by id: ${id}`);
    }

    async getDetailProfessorById(id: string): Promise<DetailProfessor> {
        const statement = `SELECT * FROM professor_detail WHERE uuid == ? LIMIT 1;`;

        const detailProfessors = await this._sqlite.query<any>(this.appDatabaseSrvc.getDB_NAME(), statement, [id]);

        const dp = detailProfessors.pop();

        if (dp) {
            const detailProfessor: DetailProfessor = {
                uuid: dp.uuid,
                category: dp.category,
                dedication: dp.dedication,
                email: dp.email,
                schedule: JSON.parse(dp.schedule),
                published: true
            };

            return detailProfessor;
        }

        throw new Error(`No data for detail professor id: ${id}`);
    }

    private getParameters(isCampus: boolean) {
        return isCampus ?
            { idx: 'idx_professor_campus', typeParam: 'campus' } :
            { idx: 'idx_professor_faculty', typeParam: 'faculty' };
    }

}
