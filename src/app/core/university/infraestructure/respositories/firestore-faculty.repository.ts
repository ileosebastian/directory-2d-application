import { inject, Injectable } from '@angular/core';
import {
    collection,
    CollectionReference,
    DocumentData,
    Firestore,
} from "@angular/fire/firestore";

import { firstValueFrom } from 'rxjs';

import { FacultyRepository } from "../../domain/repos/faculty.repository";

import { Faculty } from "../../domain/faculty.domain";

import { Constrains } from "../../../shared/models/core.interfaces";

import { executeQuery } from "../../../shared/utils/execute-firestore-query.utils";


@Injectable({
    providedIn: 'root'
})
export class FirestoreFacultyRepository implements FacultyRepository {

    private facultyCollection!: CollectionReference<DocumentData>;

    private readonly db = inject(Firestore);

    constructor() {
        this.facultyCollection = collection(this.db, "faculties");
    }

    async getAllFaculties(): Promise<Faculty[]> {
        const constrains: Constrains[] = [
            {
                type: 'where',
                field: 'published',
                filter: '==',
                value: true
            }
        ];

        const obs = executeQuery<Faculty>(
            this.facultyCollection,
            constrains
        );

        return await firstValueFrom(obs);
    }

    async getAllFacultiesByCampus(campusName: string): Promise<Faculty[]> {
        const constrains: Constrains[] = [
            {
                type: 'where',
                field: 'campus',
                filter: '==',
                value: campusName
            },
            {
                type: 'where',
                field: 'published',
                filter: '==',
                value: true
            }
        ];

        const obs = executeQuery<Faculty>(
            this.facultyCollection,
            constrains
        );

        return await firstValueFrom(obs);
    }

}