import { Injectable, WritableSignal, inject } from "@angular/core";

import { AppDatabaseService } from "./services/app-database.service";
import { FirestoreOnlineService } from "./services/firestore-online.service";
import { SqliteOfflineService } from "./services/sqlite-offline.service";

import { UniversityController } from "../university/infraestructure/university.cotroller";

import { CampusPermitted } from "../shared/models/core.types";
import { PlaneParsed } from "../map/domain/plane.domain";
import { DetailProfessor, Professor } from "../professor/domain/professor.domain";
import { DetailPlace, Place } from "../place/domain/place.domain";


@Injectable({
    providedIn: 'root'
})
export class SQLiteStoreController {

    private readonly universityCtrl = inject(UniversityController);

    private readonly appDatabaseSrvc = inject(AppDatabaseService);
    private readonly firestoreOnlineSrvc = inject(FirestoreOnlineService);

    private readonly sqliteOfflineSrvc = inject(SqliteOfflineService);

    constructor() { }

    async initializeStore(): Promise<'success' | 'error'> {
        try {
            const isPluginReady = await this.sqliteOfflineSrvc.initializePlugin();

            if (isPluginReady) {
                await this.appDatabaseSrvc.initializeDatabase();
                return 'success';
            }

            throw new Error('Error while inilizing store plugin to generate databases.');
        } catch (error) {
            console.error(`Initialize offline store error:: ${error}`);
            return 'error';
        }
    }

    async terminateStore(): Promise<void> {
        await this.appDatabaseSrvc.terminateDatabase();
    }

    async removeByCampus(campus: CampusPermitted, progress: WritableSignal<number>) {
        progress.set(0.4);
        await this.appDatabaseSrvc.deleteAllDataByCampus(campus);
        progress.set(0.8);
    }

    async saveByCampus(context: 'install' | 'update', campus: CampusPermitted, progress: WritableSignal<number>) {
        // Get remote data
        const faculties = await this.firestoreOnlineSrvc.getALLFacultiesByCampus(campus);
        progress.set(0.1);

        const ALL_proffessors = await this.firestoreOnlineSrvc.getALLProfessorsByCampus(campus);
        progress.set(0.2);

        const professors: { professor: Professor, detailProfessor: DetailProfessor }[] = [];
        const ALL_detailProfessors = await this.firestoreOnlineSrvc.getALLDetailProfessors();
        for (const professor of ALL_proffessors) {
            const detailProfessor = ALL_detailProfessors.find(detail => detail.uuid === professor.infoId);
            if (detailProfessor)
                professors.push({
                    professor,
                    detailProfessor
                });
        }
        progress.set(0.3);

        const buildings = await this.firestoreOnlineSrvc.getALLBuildingsByCampus(campus);
        progress.set(0.4);

        const plans: PlaneParsed[] = [];
        for (const building of buildings) {
            const plane = await this.firestoreOnlineSrvc.getALLPlansByBuildingId(building.uuid);
            plans.push(...plane);
        }
        progress.set(0.5);

        const ALL_places = await this.firestoreOnlineSrvc.getALLPlacesByCampus(campus);
        progress.set(0.6);

        const places: { place: Place, detailPlace: DetailPlace }[] = [];
        const ALL_detailPlaces = await this.firestoreOnlineSrvc.getALLDetailPlaces();
        for (const place of ALL_places) {
            const detailPlace = ALL_detailPlaces.find(detail => detail.placeId === place.uuid);
            if (detailPlace)
                places.push({
                    place,
                    detailPlace
                });
        }
        progress.set(0.7);

        if (context === 'update') {
            // Before installing, everything previously installed must be removed from the camps
            await this.appDatabaseSrvc.deleteAllDataByCampus(campus);
            progress.set(0.85);
        }

        // Then, install or update data by campus
        await this.appDatabaseSrvc.saveAllAppDataByCampus(campus, {
            faculties,
            buildings,
            plans,
            professors,
            places
        });

        progress.set(1.0);
    }

    async saveAllOnlineDataInDeviceByCampus(campus: CampusPermitted, progress: WritableSignal<number>) {

        // Get remote data
        const faculties = await this.firestoreOnlineSrvc.getALLFacultiesByCampus(campus);
        progress.set(0.1);

        const ALL_proffessors = await this.firestoreOnlineSrvc.getALLProfessorsByCampus(campus);
        progress.set(0.2);

        const professors: { professor: Professor, detailProfessor: DetailProfessor }[] = [];
        const ALL_detailProfessors = await this.firestoreOnlineSrvc.getALLDetailProfessors();
        for (const professor of ALL_proffessors) {
            const detailProfessor = ALL_detailProfessors.find(detail => detail.uuid === professor.infoId);
            if (detailProfessor)
                professors.push({
                    professor,
                    detailProfessor
                });
        }
        progress.set(0.3);

        const buildings = await this.firestoreOnlineSrvc.getALLBuildingsByCampus(campus);
        progress.set(0.4);

        const plans: PlaneParsed[] = [];
        for (const building of buildings) {
            const plane = await this.firestoreOnlineSrvc.getALLPlansByBuildingId(building.uuid);
            plans.push(...plane);
        }
        progress.set(0.5);

        const ALL_places = await this.firestoreOnlineSrvc.getALLPlacesByCampus(campus);
        progress.set(0.6);

        const places: { place: Place, detailPlace: DetailPlace }[] = [];
        const ALL_detailPlaces = await this.firestoreOnlineSrvc.getALLDetailPlaces();
        for (const place of ALL_places) {
            const detailPlace = ALL_detailPlaces.find(detail => detail.placeId === place.uuid);
            if (detailPlace)
                places.push({
                    place,
                    detailPlace
                });
        }
        progress.set(0.7);

        // Save data into local store
        await this.appDatabaseSrvc.saveAllAppDataByCampus(campus, {
            faculties,
            buildings,
            plans,
            professors,
            places
        });
        progress.set(0.8);

        progress.set(0.9);

        // Setup university data for first time
        await this.universityCtrl.setupUniversityData(
            campus,
            true
        );
        progress.set(1.0);

    }

    async deleteAllOnlineDataInDeviceByCampus() {
        try {
            await this.appDatabaseSrvc.deleteAllData();
        } catch (err) {
            console.error("=>", err);
        }
    }

}