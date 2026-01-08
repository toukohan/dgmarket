import { Request } from "express";

import type { QueryResult, QueryResultRow } from "pg";

export interface Db {
    query<T extends QueryResultRow = any>(
        text: string,
        values?: any[],
    ): Promise<QueryResult<T>>;
}

export interface DbRequest extends Request {
    db?: Db;
}
