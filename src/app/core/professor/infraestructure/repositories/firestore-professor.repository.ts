import { Injectable, inject } from "@angular/core";
import { CollectionReference, DocumentData, Firestore, collection } from "@angular/fire/firestore";

import { firstValueFrom } from "rxjs";
import { map } from 'rxjs/operators';

import { ProfessorRepository } from "../../domain/repos/professor.repository";

import { DetailProfessor, Professor } from "../../domain/professor.domain";
import { ProfessorsByFacultyAndPage, Constrains } from "src/app/core/shared/models/core.interfaces";

import { fixedConstrains } from "../../../shared/data/fixed-constrains.data";
import { executeQuery } from "../../../shared/utils/execute-firestore-query.utils";


@Injectable({
    providedIn: 'root'
})
export class FirestoreProfessorRepository implements ProfessorRepository {

    private professorCollection!: CollectionReference<DocumentData>;
    private professorDetailsCollection!: CollectionReference<DocumentData>;

    private pagination: ProfessorsByFacultyAndPage = {};

    private readonly db = inject(Firestore);

    constructor() {
        this.professorCollection = collection(this.db, "professors");
        this.professorDetailsCollection = collection(this.db, "professor-details");
    }

    async getProfessorById(id: string): Promise<Professor> {
        const constrainsProfessor: Constrains[] = [
            {
                type: 'where',
                filter: '==',
                field: 'id',
                value: id
            },
            {
                type: 'limit',
                value: 1
            }
        ];
        const resProfe = executeQuery<Professor>(
            this.professorCollection,
            [...constrainsProfessor, ...fixedConstrains]
        );

        const professors = await firstValueFrom(resProfe);

        const professor = professors.pop();

        if (professor) return professor;

        throw new Error(`Error to get professor by id: ${id}`);
    }

    async getDetailProfessorById(id: string): Promise<DetailProfessor> {
        const constrainsDetail: Constrains[] = [
            {
                type: 'where',
                filter: '==',
                field: 'uuid',
                value: id
            },
            {
                type: 'where',
                filter: '==',
                field: 'published',
                value: true,
            },
            {
                type: 'limit',
                value: 1
            }
        ];

        const resDetails = executeQuery<DetailProfessor>(
            this.professorDetailsCollection,
            [...constrainsDetail]
        );

        const details = await firstValueFrom(resDetails);

        const detail = details.pop();

        if (detail) return detail;

        throw new Error(`No data for detail professor id: ${id}`);
    }

    async getProfessorsByName(isCampus: boolean, facultyOrCampusName: string, name: string): Promise<Professor[]> {
        const constrains: Constrains[] = [
            {
                type: 'where',
                filter: '==',
                field: isCampus ? 'campus' : 'faculty',
                value: facultyOrCampusName
            },
            {
                type: 'orderBy',
                field: 'name',
            }
        ];

        const obs = executeQuery<Professor>(this.professorCollection, [...constrains, ...fixedConstrains])
            .pipe(
                map(professors => professors.filter(profe => profe.name.toLowerCase().includes(name))),
            );

        return await firstValueFrom(obs);
    }

    async getAllProfessors(isByCampus: boolean, facultyOrCampusName: string, limit: number, loadMoreData: boolean, isReload: boolean): Promise<Professor[]> {
        if (isReload) {
            this.pagination = {};
        }
        return this.getAllProfes(isByCampus ? 'campus' : 'faculty', facultyOrCampusName, limit, loadMoreData);
    }

    private async getAllProfes(criteria: string, value: string, limit: number, loadMore: boolean = false) {
        if (loadMore) {
            return await this.queryToPromise(criteria, value, limit);
        }

        if (this.pagination[value]) {
            return this.pagination[value].professors;
        }

        return await this.queryToPromise(criteria, value, limit);
    }

    private async queryToPromise(criteria: string, value: string, limit: number) {
        if (Object.keys(this.pagination).includes(value)) {
        } else {// new pagination
            this.pagination[value] = {
                lastValue: null,
                professors: []
            };
        }

        let val: Professor | null = null;
        const lastValue = this.pagination[value].lastValue;

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
                filter: '==',
                field: criteria,
                value: value
            },
            {
                type: 'orderBy',
                field: 'name',
            },
            {
                type: 'startAfter',
                value: val ? val.name : null // important to search alfabethically
            },
            {
                type: 'limit',
                value: limit
            }
        ];

        const obs = executeQuery<Professor>(
            this.professorCollection,
            [...constrains, ...fixedConstrains]
        );

        return await firstValueFrom(obs)
            .then(professors => {
                if (professors.length === 0) {
                    return this.pagination[value].professors;
                }

                // for best performance to reduce rendering amount
                const ALL_KEYS = Object.keys(this.pagination);
                ALL_KEYS.forEach(key => {
                    if (key === value) {
                        this.pagination[value] = {
                            lastValue: professors[professors.length - 1],
                            professors: [...this.pagination[value].professors, ...professors]
                        };
                    } else {
                        const profes = this.pagination[key].professors.slice(0, limit);
                        this.pagination[key] = {
                            lastValue: profes[profes.length - 1],
                            professors: profes
                        }
                    }
                });
                return this.pagination[value].professors;
            })
            .catch(error => {
                console.error(error);
                return this.pagination[value].professors;
            });
    }

}