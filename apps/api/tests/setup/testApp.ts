import request from "supertest";

import { createApp } from "../../src/app.js";
import { Db } from "../../src/database/index.js";

export function createTestApp(db: Db) {
    const app = createApp(db);
    return request(app);
}
