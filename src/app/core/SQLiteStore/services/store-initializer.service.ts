import { Injectable, inject } from '@angular/core';
import { SqliteOfflineService } from './sqlite-offline.service';
import { AppDatabaseService } from './app-database.service';


@Injectable({
    providedIn: 'root'
})
export class StoreInitializerService {

    isStoreReady: boolean;

    private readonly sqliteOfflineSrvc = inject(SqliteOfflineService);
    private readonly appDatabaseSrvc = inject(AppDatabaseService);

    constructor() {
        this.isStoreReady = false;
    }

    async initializeApp() {
        try {
            this.isStoreReady = await this.sqliteOfflineSrvc.initializePlugin();

            if (this.isStoreReady) {
                await this.appDatabaseSrvc.initializeDatabase();
            } else {
                throw new Error('Error while inilizing store plugin to generate databases.');
            }
        } catch (error) {
            console.error(`Initialize offline store error:: ${error}`);
        }
    }

}