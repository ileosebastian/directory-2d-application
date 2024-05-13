import { JsonSQLite } from "@capacitor-community/sqlite";
import { DB_NAME } from "../../shared/data/constants.data";
import { FacultyTableSchema } from "./faculty-table.schema";
import { ProfessorDetailTableSchema } from "./detail-professor-table.schema";
import { ProfessorTableSchema } from "./professor-table.schema";
import { PlaceDetailTableSchema } from "./detail-place-table.schema";
import { BuildingTableSchema } from "./building-table.schema";
import { PlaneTableSchema } from "./plane-table.schema";
import { PlaceTableSchema } from "./place-table.schema";


export const DirectoryDatabaseSchema: JsonSQLite = {
    database: DB_NAME,
    version: 1,
    encrypted: false,
    mode: "full",
    tables: [
        FacultyTableSchema,

        BuildingTableSchema,

        PlaneTableSchema,

        PlaceTableSchema,
        PlaceDetailTableSchema,

        ProfessorDetailTableSchema,
        ProfessorTableSchema,
    ]
};
