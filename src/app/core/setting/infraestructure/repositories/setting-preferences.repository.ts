import { Injectable } from "@angular/core";
import { Preferences } from "@capacitor/preferences";

import { SettingRepository } from "../../domain/repos/setting.repository";

import { Setting } from "../../domain/setting.domain";


export const SETTING_KEY = 'setting';


@Injectable({
    providedIn: 'root'
})
export class SettingPreferencesRepository implements SettingRepository {

    async existIntoDevice(): Promise<boolean> {
        const { value } = await Preferences.get({
            key: SETTING_KEY
        });

        return value !== null;
    }

    async setSetting(setting: Setting): Promise<void> {
        const value = JSON.stringify(setting);
        Preferences.set({
            key: SETTING_KEY,
            value
        })
            .then(() => Promise.resolve())
            .catch(() => Promise.reject());
    }

    async getSetting(): Promise<Setting> {
        const { value } = await Preferences.get({
            key: SETTING_KEY
        });

        if (value) {
            return JSON.parse(value) as Setting;
        }

        throw new Error('Error when get setting data!');
    }

}
