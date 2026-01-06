import { beforeEach, describe, it, expect } from "vitest";
import { api } from "../setup/testApp";
import pool from "../../src/database";
import { generateRefreshToken, generateAndInsertRefreshToken } from "../../src/utils/jwt";
import { hashToken } from "../../src/utils/hashing";
import { createTestUser } from "../factories/user.factory";
import { createRefreshToken } from "../../src/repositories/tokenRepository";
import { resetDb } from "../reset/db";

describe.sequential("POST /api/auth/refresh", () => {
  beforeEach(async () => {
    await resetDb();
  });

  it("returns 401 if no refresh token cookie", async () => {
    const res = await api.post("/api/auth/refresh");

    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  it("returns 403 if refresh token cookie is does not verify", async () => {
    const res = await api.post("/api/auth/refresh").set("Cookie", "refreshToken=invalid");

    expect(res.status).toBe(403);
    expect(res.body.error.message).toBe("Refresh token invalid or expired");
  });

  it("returns 401 if refresh token is expired", async () => {
    const user = await createTestUser();

    const refreshToken = generateRefreshToken(user.id);

    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, hashToken(refreshToken), new Date(Date.now() - 1000)],
    );

    const res = await api.post("/api/auth/refresh").set("Cookie", `refreshToken=${refreshToken}`);

    expect(res.status).toBe(401);
  });
  it("returns new access token if refresh token is valid", async () => {
    const user = await createTestUser();
    const refreshToken = generateRefreshToken(user.id);
    await createRefreshToken(user.id, refreshToken, new Date(Date.now() + 60_000));

    const res = await api.post("/api/auth/refresh").set("Cookie", `refreshToken=${refreshToken}`);
    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.headers["set-cookie"]).toBeDefined();
  });
});
