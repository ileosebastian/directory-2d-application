import { JsonTable } from "@capacitor-community/sqlite";


export const PlaceDetailTableSchema: JsonTable = {
    name: 'place_detail',
    schema: [
        {
            column: 'placeId',
            value: 'text primary key not null',
        },
        {
            column: 'floor',
            value: 'TINYINT NOT NULL',
        },
        {
            column: 'belongsProfessor',
            value: 'TINYINT DEFAULT 0',
        },
        {
            column: 'professorsId',
            value: 'TEXT',
        },
    ],
};
