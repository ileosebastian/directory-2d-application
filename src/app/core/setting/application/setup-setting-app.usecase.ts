import { DEFAULT_SETTING } from "../../shared/data/constants.data";
import { SettingRepository } from "../domain/repos/setting.repository";
import { Setting } from "../domain/setting.domain";


export class SetupSettingAppUseCase {

    constructor(private readonly settingRepo: SettingRepository) {}

    async run(isAvaliablePlugin: boolean): Promise<Setting> {
        if (isAvaliablePlugin) {
            const isExist = await this.settingRepo.existIntoDevice();

            if (isExist) {
                return await this.settingRepo.getSetting();
            } else {
                await this.settingRepo.setSetting(DEFAULT_SETTING);
            }
            
        }

        return DEFAULT_SETTING;
    }

}