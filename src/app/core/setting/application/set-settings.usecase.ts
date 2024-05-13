import { SettingRepository } from "../domain/repos/setting.repository";
import { Setting } from "../domain/setting.domain";


export class SetSettingsUseCase {

    constructor(private readonly settingRepo: SettingRepository) {}

    async run(setting: Setting) {
        await this.settingRepo.setSetting(setting);
        return await this.settingRepo.getSetting();
    }

}