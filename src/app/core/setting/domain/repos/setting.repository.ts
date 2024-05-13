import { Setting } from "../setting.domain";


export interface SettingRepository {

    existIntoDevice(): Promise<boolean>;
    setSetting(setting: Setting): Promise<void>;
    getSetting(): Promise<Setting>;

}
