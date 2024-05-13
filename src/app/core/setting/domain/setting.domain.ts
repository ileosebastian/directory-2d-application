import { CampusPermitted } from "../../shared/models/core.types";

export interface Setting {
    isFirstBoot: boolean;

    useMobileData: boolean;

    chosenCampus: CampusPermitted;

    installedCampusPackages: CampusPermitted[];
}
