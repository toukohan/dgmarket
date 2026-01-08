import type { Response } from "supertest";

type JwtCookies = {
    accessToken: string | undefined;
    refreshToken: string | undefined;
};

export function extractJwtCookies(res: Response): JwtCookies {
    const cookies = res.headers["set-cookie"];
    const result: JwtCookies = {
        accessToken: undefined,
        refreshToken: undefined,
    };

    if (!cookies) {
        return result;
    }

    for (const cookie of cookies) {
        if (cookie.startsWith("accessToken=")) {
            result.accessToken = cookie.split(";")[0].split("=")[1];
        }

        if (cookie.startsWith("refreshToken=")) {
            result.refreshToken = cookie.split(";")[0].split("=")[1];
        }
    }

    return result;
}
