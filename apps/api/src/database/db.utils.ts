// db.guard.ts
import { Db, DbRequest } from "./db.types";

const isDb = (value: unknown): value is Db => {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const obj = value as Record<string, unknown>;

    return typeof obj.query === "function";
};

export const extractDb = (req: DbRequest): Db => {
    if (!isDb(req.db)) throw new Error("db missing");
    return req.db;
};
