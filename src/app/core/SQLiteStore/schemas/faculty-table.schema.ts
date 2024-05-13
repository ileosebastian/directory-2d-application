import { JsonTable } from "@capacitor-community/sqlite";


export const FacultyTableSchema: JsonTable = {
    name: 'faculty',
    schema: [
        {
            column: 'id',
            value: 'INTEGER PRIMARY KEY AUTOINCREMENT',
        },
        {
            column: 'campus',
            value: 'VARCHAR(40) NOT NULL'
        },
        {
            column: 'name',
            value: 'VARCHAR(70) NOT NULL UNIQUE'
        }
    ],
    indexes: [
        {
            name: 'idx_faculty_campus',
            value: 'campus'
        }
    ]
}