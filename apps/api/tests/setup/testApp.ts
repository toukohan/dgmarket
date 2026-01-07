import request from "supertest";

import { createApp } from "../../src/app";
// pass in test to run with test env

export const app = createApp("test");
export const api = request(app);
