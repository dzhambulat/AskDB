import PostgresSqlProvider from "../../db/postgressql";
import { QueryResult } from "../../types/db";
import { Tool } from "@langchain/core/tools";
import Promise from "bluebird";

type TableName = {
    name: string;
}
type ColumnSchema = {
    tableName: string;
    columnName: string;
    dataType: string;
}

class GetSchemaTool extends Tool {
    name = "execute_sql";
    description = "Retrieves a list with columns names for each table in the database \
    in the format of <table_name>: <table_name>.<column_name>-<data_type> on each line";
    constructor(private readonly sqlProvider: PostgresSqlProvider) {
        super({

        });
    }

    async _call() {
        return await getSchema(this.sqlProvider);
    }
}

async function getSchema(sqlProvider: PostgresSqlProvider) {
    const tables = await sqlProvider.makeQuery<TableName>(`SELECT table_name as name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'`);

    const tableSchemas = await Promise.map(tables, async (table: TableName) => {
        return await sqlProvider.makeQuery<ColumnSchema>(`
            SELECT ${table.name} as name, column_name as columnName, data_type as dataType
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = '${table.name}'
          `);
    });

    const schemasString: string[] = tableSchemas?.map(tableColumnsSchema => {
        const tableSchemaString = tableColumnsSchema.map((schema: ColumnSchema) => {
            return `${schema.tableName}.${schema.columnName}: ${schema.dataType}`;
        });
        return `${tableColumnsSchema[0].tableName}: ${tableSchemaString.join('-')}`;
    });

    return schemasString.join('\n');
}

export default new GetSchemaTool(new PostgresSqlProvider());