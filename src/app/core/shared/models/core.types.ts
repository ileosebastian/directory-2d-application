
export type DialogState = 'welcome' | 'selection' | 'installation' | 'cancel' | 'disconnected' | 'exit-dialog' | 'installation-error' | 'database-error' | 'bootstrap-error';

export type CampusPermitted = 'portoviejo' | 'lodana' | 'chone';

export type KeyPlacePagination = `${string}-${string}`; //  (faculty or campus)-category

export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export type BlockRole =
    'obstacle' |
    'invisible_lock_down' |
    'invisible_lock_up' |
    'waypoint';

export type WaypointType =
    'origin_first_floor' |
    'origin_previous_floor' |
    'origin_next_floor' |
    'previous_floor' |
    'next_floor' |
    'destiny';

export type KindOption = 'top-left-corner' |
    'top' |
    'top-right-corner' |
    'left' |
    'body' |
    'right' |
    'bottom-left-corner' |
    'bottom' |
    'bottom-right-corner';

export type ScopeFilter = 'professor' | 'place';

export type AllFaculties = 'todos';

export type SearchingType = 'professors' | 'places' | 'general'; 

export type AvaliableDatabases = 'directory.db';
