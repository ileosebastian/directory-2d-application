import { Injectable, inject } from "@angular/core";


import { firstValueFrom } from "rxjs";

import { addIcons } from "ionicons";

import { SettingController } from "./core/setting/infraestructure/setting.controller";
import { SQLiteStoreController } from "./core/SQLiteStore/sqlite-store.controller";
import { GetStaticDataService } from "./views/shared/services/http/get-static-data.service";
import { NetworkService } from "./views/shared/services/network/network.service";

import { Setting } from "./core/setting/domain/setting.domain";
import { DialogState } from "./core/shared/models/core.types";
import { DEFAULT_SETTING } from "./core/shared/data/constants.data";


@Injectable({
    providedIn: 'root'
})
export class AppService {

    isOnline: boolean;
    isStoreReady: boolean;
    setting: Setting;
    dialogState: DialogState;

    private readonly settingCtrl = inject(SettingController);
    private readonly networkSrvc = inject(NetworkService);
    private readonly storeCtrl = inject(SQLiteStoreController);
    private readonly staticDataSrvc = inject(GetStaticDataService);

    constructor() {
        this.isOnline = false;
        this.isStoreReady = false;
        this.setting = DEFAULT_SETTING;
        // set initial state for dislog bootstrap 
        this.dialogState = 'bootstrap-error';
        // init listening changes when open network status
        this.networkSrvc.initListenNetworkStatus();
    }

    async initializeApp() {
        try {

            await this.setCustomIcons();

            this.setting = await this.settingCtrl.initApplicationSetting();

            this.isOnline = await this.networkSrvc
                .setOnlineModeBySettings(this.setting);

            const storeStatus = await this.storeCtrl.initializeStore();

            if (storeStatus === 'success') {
                this.dialogState = 'welcome';
            }

            if (storeStatus === 'error') {
                await this.settingCtrl.setSettings(DEFAULT_SETTING);
                this.setting = DEFAULT_SETTING;
                this.dialogState = 'database-error';
            }

        } catch (error) {
            console.error("Error initializing services => ", error);
        }
    }

    async terminateApp() {
        await this.storeCtrl.terminateStore();
    }


    private async setCustomIcons() {
        const obs = this.staticDataSrvc.getClearCategoryIcons();

        const categories = await firstValueFrom(obs);

        for (const cat of categories) {
            const name = cat.category;
            const path = cat.pathIcon;
            addIcons({
                [name]: path
            });
        }

        addIcons({ user: '../../../assets/icons/clear/user.svg' });
    }

}
