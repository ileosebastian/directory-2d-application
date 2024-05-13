import { SettingRepository } from "../domain/repos/setting.repository";


export class GetSettingsUseCase {

    constructor(private readonly settingRepo: SettingRepository) {}

    async run() {
        return await this.settingRepo.getSetting();
    }

}