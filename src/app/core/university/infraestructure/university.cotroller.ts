import { Injectable, inject } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { FirestoreFacultyRepository } from "./respositories/firestore-faculty.repository";
import { InMemoryCampusRepository } from './respositories/in-memory-campus.repository';
import { SqliteFacultyRepository } from './respositories/sqlite-faculty.repository';

import { GetCampusListUseCase } from '../application/get-campus-list.usecase';
import { GetFacultyListByCampusUseCase } from "../application/get-faculty-list-by-campus.usecase";

import { CampusPermitted } from '../../shared/models/core.types';


@Injectable({
    providedIn: 'root'
})
export class UniversityController {

    private readonly inMemoryCampusRepo = inject(InMemoryCampusRepository);
    private readonly firestoreFacultyRepo = inject(FirestoreFacultyRepository);
    private readonly sqliteFacyltyRepo = inject(SqliteFacultyRepository);

    // Instances for online mode
    private readonly getFacultiesByCampusUCOnline: GetFacultyListByCampusUseCase;
    // Instances for offline mode
    private readonly getFacultiesByCampusUCOffline: GetFacultyListByCampusUseCase;
    private readonly getCampusListUCOffline: GetCampusListUseCase;

    currentCampus!: BehaviorSubject<CampusPermitted>;

    constructor() {
        this.getCampusListUCOffline = new GetCampusListUseCase(this.inMemoryCampusRepo);

        this.getFacultiesByCampusUCOnline = new GetFacultyListByCampusUseCase(this.firestoreFacultyRepo);
        this.getFacultiesByCampusUCOffline = new GetFacultyListByCampusUseCase(this.sqliteFacyltyRepo);
    }

    async setupUniversityData(campus: CampusPermitted, isOnline: boolean = false) {
        this.setCampusFirstTime(campus);
        // const campuses = await this.getCampusList();
    }

    getCurrentCampus() {
        return this.currentCampus.value;
    }

    private setCampusFirstTime(campus: CampusPermitted) {
        this.currentCampus = new BehaviorSubject(campus);
    }

    async changeCampus(campus: CampusPermitted) {
        this.currentCampus.next(campus);
    }

    getCampusList() {
        return this.getCampusListUCOffline.run();
    }

    async getFacultyListByCampus(campus: CampusPermitted, isOnlineMode: boolean = false) {
        return isOnlineMode ?
            await this.getFacultiesByCampusUCOnline.run(campus) :
            await this.getFacultiesByCampusUCOffline.run(campus);
    }

}