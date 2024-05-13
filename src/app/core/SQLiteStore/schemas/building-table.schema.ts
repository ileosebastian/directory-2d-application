import { JsonTable } from "@capacitor-community/sqlite";


export const BuildingTableSchema: JsonTable = {
    name: 'building',
    schema: [
        {
            column: 'uuid',
            value: 'TEXT PRIMARY KEY NOT NULL',
        },
        {
            column: 'campus',
            value: 'VARCHAR(40) NOT NULL',
        },
        {
            column: 'faculty',
            value: 'VARCHAR(70) NOT NULL',
        },
        {
            column: 'floors',
            value: 'TINYINT NOT NULL',
        },
        {
            column: 'name',
            value: 'VARCHAR(100)',
        },
    ],
    indexes: [
        {
            name: 'idx_building_campus',
            value: 'campus'
        },
        {
            name: 'idx_building_faculty',
            value: 'faculty'
        },
    ],
};