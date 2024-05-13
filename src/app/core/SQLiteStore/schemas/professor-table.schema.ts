import { JsonTable } from "@capacitor-community/sqlite";


export const ProfessorTableSchema: JsonTable = {
    name: 'professor',
    schema: [
        {
            column: 'id',
            value: 'TEXT PRIMARY KEY NOT NULL',
        },
        {
            column: 'name',
            value: 'TEXT NOT NULL'
        },
        {
            column: 'campus',
            value: 'VARCHAR(40) NOT NULL'
        },
        {
            column: 'faculty',
            value: 'VARCHAR(70) NOT NULL'
        },
        {
            column: 'department',
            value: 'VARCHAR(50)'
        },
        {
            column: 'office',
            value: 'VARCHAR(10) NOT NULL'
        },
        {
            column: 'infoId',
            value: 'TEXT NOT NULL',
            foreignkey: 'professor_detail (uuid)'
        },
    ],
    indexes: [
        {
            name: 'idx_professor_campus',
            value: 'campus'
        },
        {
            name: 'idx_professor_faculty',
            value: 'faculty'
        },
    ]
};
