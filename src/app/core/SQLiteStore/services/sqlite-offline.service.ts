import { Injectable } from "@angular/core";
import { CapacitorSQLite, CapacitorSQLitePlugin, JsonSQLite } from "@capacitor-community/sqlite";
import { Capacitor } from "@capacitor/core";

import { SetStatement } from "../../shared/models/core.interfaces";
import { AvaliableDatabases } from "../../shared/models/core.types";


type Platform = 'web' | 'android' | 'ios';

@Injectable({
    providedIn: 'root'
})
export class SqliteOfflineService {

    platform!: Platform;
    sqlitePlugin!: CapacitorSQLitePlugin;

    constructor() { }

    async initializePlugin() {
        this.platform = Capacitor.getPlatform() as Platform;
        this.sqlitePlugin = CapacitorSQLite;

        await this.initWebStore();

        return true;
    }

    private async initWebStore() {
        if (this.platform === 'web') await this.sqlitePlugin.initWebStore();
    }

    async openDatabase(
        database: AvaliableDatabases,
        encrypted: boolean,
        mode: string,
        version: number,
        readonly: boolean
    ): Promise<void> {

        // let openDB: boolean = false;
        // const isExist = await this.sqlitePlugin.isDatabase({ database, readonly });

        // if (isExist.result) {
        //     if (this.platform !== 'web') {
        //         const res = await this.sqlitePlugin.isDBOpen({ database, readonly });
        //         openDB = res.result === true;
        //     }
        // }

        // if (!openDB) {
        try {
            await this.sqlitePlugin.createConnection({ database, encrypted, mode, version, readonly });
            await this.sqlitePlugin.open({ database, readonly });
        } catch (error) {
            console.error(`Open Database Error => ${error}`);
        }
        // }

    }

    async closeConnection(database: AvaliableDatabases, readonly?: boolean): Promise<void> {

        return await this.sqlitePlugin.closeConnection({ database, readonly });

    }

    async setupSchemas(schemas: JsonSQLite) {

        const jsonstring = JSON.stringify(schemas ?? {});
        const isValidSchema = await this.sqlitePlugin.isJsonValid({ jsonstring });

        if (isValidSchema.result) {
            const exist = await this.sqlitePlugin.isDatabase({ database: schemas.database });

            if (!exist.result) {
                await this.sqlitePlugin.importFromJson({ jsonstring });
                return;
            }

            return;
        }

        throw new Error(`The schemas are not valid.`);

    }

    async executeSet(database: AvaliableDatabases, set: SetStatement[], transaction: boolean) {

        await this.sqlitePlugin.executeSet({
            database,
            set,
            transaction
        });
        await this.saveToStore(database);

    }

    async query<T>(database: AvaliableDatabases, statement: string, values: any[]) {

        const response = await this.sqlitePlugin.query({
            database,
            statement,
            values
        });

        if (response.values) {
            const valuesToReturn: T[] = [];
            for (const value of response.values) {
                valuesToReturn.push(value);
            }
            return valuesToReturn;
        }

        throw new Error('Query Error: No matching values for statements.');

    }

    async saveToStore(database: AvaliableDatabases): Promise<void> {

        if (this.platform === 'web') await this.sqlitePlugin.saveToStore({ database });

    }

}
