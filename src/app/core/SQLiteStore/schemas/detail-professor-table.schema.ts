import { JsonTable } from "@capacitor-community/sqlite";


export const ProfessorDetailTableSchema: JsonTable = {
    name: 'professor_detail',
    schema: [
        {
            column: 'uuid',
            value: 'TEXT PRIMARY KEY NOT NULL',
        },
        {
            column: 'category',
            value: 'VARCHAR(50)'
        },
        {
            column: 'dedication',
            value: 'VARCHAR(50)'
        },
        {
            column: 'email',
            value: 'VARCHAR(80) NOT NULL UNIQUE'
        },
        {
            column: 'schedule',
            value: 'TEXT'
        },
    ],
}