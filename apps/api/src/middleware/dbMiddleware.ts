import express from "express";

import { Db, DbRequest } from "../database/index.js";

export const dbMiddleware = (db: Db): express.RequestHandler => {
    return (req: DbRequest, _res, next) => {
        req.db = db;
        next();
    };
};
