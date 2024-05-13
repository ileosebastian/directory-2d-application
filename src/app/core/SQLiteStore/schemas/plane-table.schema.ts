import { JsonTable } from "@capacitor-community/sqlite";


export const PlaneTableSchema: JsonTable = {
    name: 'plane',
    schema: [
        {
            column: 'uuid',
            value: 'TEXT PRIMARY KEY NOT NULL',
        },
        {
            column: 'columns',
            value: 'INTEGER NOT NULL',
        },
        {
            column: 'rows',
            value: 'INTEGER NOT NULL',
        },
        {
            column: 'widthTiles',
            value: 'TINYINT NOT NULL',
        },
        {
            column: 'heightTiles',
            value: 'TINYINT NOT NULL',
        },
        {
            column: 'stage',
            value: 'TEXT NOT NULL UNIQUE',
        },
        {
            column: 'floor',
            value: 'TINYINT NOT NULL',
        },
        {
            column: 'waypoints',
            value: 'TEXT NOT NULL',
        },
        {
            column: 'buildingId',
            value: 'TEXT NOT NULL',
            foreignkey: 'building (uuid)',
        },
    ],
};
