import request from "supertest";

import { createApp } from "@/app";
import { Db } from "@/database";

export function createTestApp(db: Db) {
    const app = createApp(db);
    return request(app);
}
