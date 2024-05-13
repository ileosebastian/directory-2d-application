import { JsonSQLite } from "@capacitor-community/sqlite";
import { AvaliableDatabases } from '../../shared/models/core.types';
import { DirectoryDatabaseSchema } from "./directory-database.schema";


type AvaliableSchemasByDatabase = {
    [key in AvaliableDatabases]: JsonSQLite
}


export const DATABASES: AvaliableSchemasByDatabase = {
    'directory.db': DirectoryDatabaseSchema,
};
