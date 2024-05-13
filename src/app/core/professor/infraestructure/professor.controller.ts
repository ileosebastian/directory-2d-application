import { Injectable, inject } from "@angular/core";

import { FirestoreProfessorRepository } from "./repositories/firestore-professor.repository";

import { SearchProfessorsUseCase } from "../application/search-professors.usecase";
import { GetAllDetailsProfessorUseCase } from '../application/get-all-data-professor.usecase';
import { SearchProfessorByNamesUseCase } from "../application/search-professor-by-name.usecase";
import { GetProfessorsByListIdUseCase } from "../application/get-professors-by-list-id.usecase";

import { AllDetailsProfessor } from "../domain/professor.domain";
import { LIMIT_FOR_MOBILE, LIMIT_FOR_WEB_DESKTOP } from "../../shared/data/constants.data";

import { isAMobileDevice } from "../../shared/utils/is-a-mobile-device.util";
import { SqliteProfessorRepository } from "./repositories/sqlite-professor.repository";


@Injectable({
    providedIn: 'root'
})
export class ProfessorController {

    private readonly firestoreRepo = inject(FirestoreProfessorRepository);
    private readonly sqliteRepo = inject(SqliteProfessorRepository);


    // Instances for online mode
    private readonly searchAllProfesUCOnline: SearchProfessorsUseCase;
    private readonly searchProfessorByNameUCOnline: SearchProfessorByNamesUseCase;
    private readonly getAllDetailsProfessorUCOnline: GetAllDetailsProfessorUseCase;
    private readonly getProfessorsByListIdUCOnline: GetProfessorsByListIdUseCase;
    // Instances for offline mode
    private readonly searchAllProfesUCOffline: SearchProfessorsUseCase;
    private readonly searchProfessorByNameUCOffline: SearchProfessorByNamesUseCase;
    private readonly getAllDetailsProfessorUCOffline: GetAllDetailsProfessorUseCase;
    private readonly getProfessorsByListIdUCOffline: GetProfessorsByListIdUseCase;

    constructor() {
        this.searchAllProfesUCOnline = new SearchProfessorsUseCase(this.firestoreRepo);
        this.searchProfessorByNameUCOnline = new SearchProfessorByNamesUseCase(this.firestoreRepo);
        this.getAllDetailsProfessorUCOnline = new GetAllDetailsProfessorUseCase(this.firestoreRepo);
        this.getProfessorsByListIdUCOnline = new GetProfessorsByListIdUseCase(this.firestoreRepo);

        this.searchAllProfesUCOffline = new SearchProfessorsUseCase(this.sqliteRepo);
        this.searchProfessorByNameUCOffline = new SearchProfessorByNamesUseCase(this.sqliteRepo);
        this.getAllDetailsProfessorUCOffline = new GetAllDetailsProfessorUseCase(this.sqliteRepo);
        this.getProfessorsByListIdUCOffline = new GetProfessorsByListIdUseCase(this.sqliteRepo);
    }

    async searchAllProfessors(isOnline: boolean, criteria: string, value: string, loadMore: boolean = false, isReload: boolean = false) {
        return isOnline ?
            await this.searchAllProfesUCOnline
                .run(
                    criteria,
                    value,
                    isAMobileDevice() ? LIMIT_FOR_MOBILE : LIMIT_FOR_WEB_DESKTOP,
                    loadMore,
                    isReload
                ) :
            await this.searchAllProfesUCOffline
                .run(
                    criteria,
                    value,
                    isAMobileDevice() ? LIMIT_FOR_MOBILE : LIMIT_FOR_WEB_DESKTOP,
                    loadMore,
                    isReload
                );
    }

    async searchProfessorByName(isOnline: boolean, criteria: string, value: string, name: string) {
        return isOnline ?
            await this.searchProfessorByNameUCOnline.run(criteria, value, name) :
            await this.searchProfessorByNameUCOffline.run(criteria, value, name);
    }

    async getAllDetailsProfessorById(isOnline: boolean, id: string) {
        return isOnline ?
            await this.getAllDetailsProfessorUCOnline.run(id) :
            await this.getAllDetailsProfessorUCOffline.run(id);
    }

    async getDetailProfessorsByIdList(isOnline: boolean, listId: string[]): Promise<AllDetailsProfessor[]> {
        return isOnline ?
            await this.getProfessorsByListIdUCOnline.run(listId) :
            await this.getProfessorsByListIdUCOffline.run(listId);
    }

}