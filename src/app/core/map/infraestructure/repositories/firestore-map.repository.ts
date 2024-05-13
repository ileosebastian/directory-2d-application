import { Injectable, WritableSignal, effect, inject } from "@angular/core";
import { CollectionReference, DocumentData, Firestore, collection } from "@angular/fire/firestore";

import { firstValueFrom } from "rxjs";

import { ReloadDataService } from "src/app/views/shared/services/reload-data.service";
import { MapRepository } from "../../domain/repos/map.repository";

import { Building } from '../../domain/building.domain';
import { PlaneParsed } from "../../domain/plane.domain";
import { BuildingByFacultyPagination, Constrains, PlansParsedByBuildingIdPagination } from "../../../shared/models/core.interfaces";

import { UUID } from "../../../shared/models/core.types";

import { executeQuery } from "../../../shared/utils/execute-firestore-query.utils";


@Injectable({
    providedIn: 'root'
})
export class FirestoreMapRepository implements MapRepository {

    private buildingCollection!: CollectionReference<DocumentData>;
    private planeCollection!: CollectionReference<DocumentData>;

    private buildingPagination: BuildingByFacultyPagination = {};
    private plansPagination: PlansParsedByBuildingIdPagination = {};

    private isReload: WritableSignal<boolean>;

    private readonly db = inject(Firestore);
    private readonly reloadDataSrvc = inject(ReloadDataService);

    private ruleConstrain: Constrains = {
        type: 'where',
        filter: '==',
        field: 'published',
        value: true
    };

    constructor() {
        this.isReload = this.reloadDataSrvc.getIsReload();
        this.buildingCollection = collection(this.db, 'buildings');
        this.planeCollection = collection(this.db, 'plans');

        effect(() => {
            if (this.isReload()) {
                this.buildingPagination = {};
                this.plansPagination = {};
            }
        });
    }

    async getBuildingByFaculty(facultyName: string): Promise<Building> {
        if (!this.buildingPagination[facultyName]) {
            const constrains: Constrains[] = [
                {
                    type: 'where',
                    filter: '==',
                    field: 'faculty',
                    value: facultyName
                },
                {
                    type: 'limit',
                    value: 1
                }
            ];

            const obs = executeQuery<Building>(this.buildingCollection, [...constrains, this.ruleConstrain]);
            const buildings = await firstValueFrom(obs);
            this.buildingPagination[facultyName] = buildings[0];
        }

        return this.buildingPagination[facultyName];
    }

    async getPlansByBuildingId(buildingId: UUID, limitOfFloors: number): Promise<PlaneParsed[]> {
        if (!this.plansPagination[buildingId]) {
            const constrains: Constrains[] = [
                {
                    type: 'where',
                    filter: '==',
                    field: 'buildingId',
                    value: buildingId
                },
                {
                    type: 'limit',
                    value: limitOfFloors
                }
            ];

            const obs = executeQuery<PlaneParsed>(this.planeCollection, [...constrains, this.ruleConstrain]);
            this.plansPagination[buildingId] = await firstValueFrom(obs);
        }

        return this.plansPagination[buildingId];
    }

}