import express from "express";

import { Db, DbRequest } from "@/database";

export const dbMiddleware = (db: Db): express.RequestHandler => {
    return (req: DbRequest, _res, next) => {
        req.db = db;
        next();
    };
};
