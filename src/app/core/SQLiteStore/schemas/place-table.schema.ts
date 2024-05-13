import { JsonTable } from "@capacitor-community/sqlite";


export const PlaceTableSchema: JsonTable = {
    name: 'place',
    schema: [
        {
            column: 'uuid',
            value: 'TEXT PRIMARY KEY NOT NULL',
        },
        {
            column: 'name',
            value: 'VARCHAR(100) NOT NULL',
        },
        {
            column: 'code',
            value: 'VARCHAR(10) NOT NULL',
        },
        {
            column: 'title',
            value: 'TEXT',
        },
        {
            column: 'category',
            value: 'VARCHAR(25) NOT NULL',
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
            column: 'wayPointId',
            value: 'TEXT NOT NULL',
        },
        {
            column: 'planeId',
            value: 'TEXT NOT NULL',
            foreignkey: 'plane (uuid)'
        },
    ],
    indexes: [
        {
            name: 'idx_place_campus_category',
            value: 'campus, category'
        },
        {
            name: 'idx_place_faculty_category',
            value: 'faculty, category'
        },
        {
            name: 'idx_place_campus',
            value: 'campus'
        },
        {
            name: 'idx_place_faculty',
            value: 'faculty'
        },
    ],
};
