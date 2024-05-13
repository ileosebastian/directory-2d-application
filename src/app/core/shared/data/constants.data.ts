import { Setting } from "../../setting/domain/setting.domain";

// default settings
export const DEFAULT_SETTING: Setting = {
    isFirstBoot: true,
    useMobileData: false,
    chosenCampus: 'portoviejo',
    installedCampusPackages: []
};

export const FOR_ALL_FACULTIES = 'all';

export const FOR_ONE_FACULTY = 'one';

export const ALL_CAMPUS_KEY = 'todos';

export const ALL_FACULTIES_KEY = 'todos';

export const PROFESSOR_SEARCH_KEY = 'professors';

export const PLACE_SEARCH_KEY = 'places';

export const GENERAL_SEARCH_KEY = 'general';

export const USER_DONT_KNOW_WHERE_IS = 'dont-know';

export const ENTRY_CATEGORY_KEY = 'Entradas al edificio';

export const ENTRY_FIRST_FLOOR_TITLE = 'Puerta principal (Planta Baja)';

export const FRAMES = 12;

export const LIMIT_FOR_MOBILE = 8;

export const LIMIT_FOR_WEB_DESKTOP = 50;

const spritesPath = '../../../../../assets/sprites/';

export const sourceByCategory: { [key: string]: string } = {
    'user': spritesPath + 'user.svg',
    'audience': spritesPath + 'audience.svg',
    'bathroom': spritesPath + 'bathroom.svg',
    'classroom': spritesPath + 'classroom.svg',
    'data-center': spritesPath + 'data-center.svg',
    'elevator': spritesPath + 'elevator.svg',
    'admin-office': spritesPath + 'office-admin.svg',
    'profe-office': spritesPath + 'office-profe.svg',
    'emergency': spritesPath + 'emergency.svg',
    'stair-vertical': spritesPath + 'stair.svg',
    'stair-horizontal': spritesPath + 'stair-90.svg',
    'floor-location': spritesPath + 'location/floor-location.svg',
    'destiny-location': spritesPath + 'location/location.svg',
}

export const DB_NAME = 'directory.db';