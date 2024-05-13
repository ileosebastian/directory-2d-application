import { Injectable, inject } from "@angular/core";

import { FirestoreMapRepository } from "./repositories/firestore-map.repository";

import { GenerateInitStateUseCase } from "../application/generate-init-state.usecase";
import { GetEntryBuildingByPlansUseCase } from "../application/get-entry-building-by-plans.usecase";

import { UUID } from "../../shared/models/core.types";
import { Plane } from "../domain/plane.domain";
import { SqliteMapRepository } from "./repositories/sqlite-map.repository";


@Injectable({
    providedIn: 'root'
})
export class MapController {

    private readonly firestoreRepo = inject(FirestoreMapRepository);
    private readonly sqliteRepo = inject(SqliteMapRepository);

    // Instances for online mode
    private readonly generateInitStateUCOnline: GenerateInitStateUseCase;
    // Instances for offline mode
    private readonly generateInitStateUCOffline: GenerateInitStateUseCase;

    private readonly getEntriessUseCase: GetEntryBuildingByPlansUseCase;

    constructor() {
        this.generateInitStateUCOnline = new GenerateInitStateUseCase(this.firestoreRepo);

        this.generateInitStateUCOffline = new GenerateInitStateUseCase(this.sqliteRepo);

        this.getEntriessUseCase = new GetEntryBuildingByPlansUseCase();
    }

    async generateInitialState(
        isOnlineMode: boolean,
        facultyName: string,
        originWaypointId: UUID | null = null,
        destinyWaypointId: UUID
    ) {
        return isOnlineMode ?
            await this.generateInitStateUCOnline.run(facultyName, originWaypointId, destinyWaypointId) :
            await this.generateInitStateUCOffline.run(facultyName, originWaypointId, destinyWaypointId);
    }

    getEntriesByPlans(PLANS: Plane[]) {
        return this.getEntriessUseCase.run(PLANS);
    }

}
