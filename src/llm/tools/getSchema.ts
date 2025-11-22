import { IDatabaseProvider } from "../../types/db";
import { tool, createAgent } from "langchain";
import Promise from "bluebird";
import PostgresSqlProvider from "../../db/postgressql";

type TableName = {
    name: string;
}
type ColumnSchema = {
    tableName: string;
    columnName: string;
    dataType: string;
}

const sqlProvider = new PostgresSqlProvider();
sqlProvider.connect();

export const getSchemaTool = tool(
    () => {
        return getSchema(sqlProvider);
    },
    {
        name: "get_schema",
        description: "Retrieves a list with columns names for each table in the database \
        in the format of <table_name>: <column_name>-<data_type>;<column_name2>-<data_type2>...",
    }
);

async function getSchema(sqlProvider: IDatabaseProvider) {

    const tables = await sqlProvider.makeQuery<TableName>(`SELECT table_name as name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'`);

    const tableSchemas = await Promise.map( tables, async (table: TableName) => {
        return sqlProvider.makeQuery<ColumnSchema>(`
            SELECT '${table.name}' as "tableName", column_name as "columnName", data_type as "dataType"
            FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = '${table.name}'`);
    });

    const schemasString: string[] = tableSchemas?.map(tableColumnsSchema => {
        const tableSchemaString: string[] = tableColumnsSchema.map((schema: ColumnSchema) => {
            return `${schema.columnName}-${schema.dataType}`;
        });
        return `${tableColumnsSchema[0].tableName}: ${tableSchemaString.join(';')}\n`;
    });

    return schemasString.join('\n');
}