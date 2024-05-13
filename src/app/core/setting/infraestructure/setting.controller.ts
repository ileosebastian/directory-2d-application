import { Injectable, inject } from '@angular/core';
import { isPlatform } from '@ionic/angular/standalone';

import { SettingPreferencesRepository } from './repositories/setting-preferences.repository';

import { SetupSettingAppUseCase } from '../application/setup-setting-app.usecase';
import { SetSettingsUseCase } from '../application/set-settings.usecase';
import { GetSettingsUseCase } from '../application/get-settings.usecase';

import { Setting } from '../domain/setting.domain';


@Injectable({
    providedIn: 'root'
})
export class SettingController {

    private readonly preferencePlugin = inject(SettingPreferencesRepository);

    private setupAppUseCase: SetupSettingAppUseCase;
    private getCurrentSettigUseCase: GetSettingsUseCase;
    private setSettingUseCase: SetSettingsUseCase;

    constructor() {
        this.setupAppUseCase = new SetupSettingAppUseCase(this.preferencePlugin);
        this.getCurrentSettigUseCase = new GetSettingsUseCase(this.preferencePlugin);
        this.setSettingUseCase = new SetSettingsUseCase(this.preferencePlugin);
    }

    async initApplicationSetting() {
        return await this.setupAppUseCase
            .run(
                isPlatform('capacitor') ||
                isPlatform('mobileweb') ||
                isPlatform('android') ||
                isPlatform('desktop')
            );
    }

    async getCurrentSettings() {
        return await this.getCurrentSettigUseCase.run();
    }

    async setSettings(setting: Setting) {
        return await this.setSettingUseCase.run(setting);
    }

}
