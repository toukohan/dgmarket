import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

function loadKeyFromFile(envName: string) {
    const p = process.env[envName];
    if (!p) throw new Error(`${envName} is not set`);
    const joined = path.join(process.cwd(), p);

    return fs.readFileSync(joined, "utf8");
}

function generateTestKeyPair() {
    return crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });
}

export function loadJwtKeys() {
    if (process.env.NODE_ENV === "test") {
        const access = generateTestKeyPair();
        const refresh = generateTestKeyPair();

        return {
            privateAccessKey: access.privateKey,
            publicAccessKey: access.publicKey,
            privateRefreshKey: refresh.privateKey,
            publicRefreshKey: refresh.publicKey,
        };
    }

    return {
        privateAccessKey: loadKeyFromFile("ACCESS_PRIVATE_KEY_PATH"),
        publicAccessKey: loadKeyFromFile("ACCESS_PUBLIC_KEY_PATH"),
        privateRefreshKey: loadKeyFromFile("REFRESH_PRIVATE_KEY_PATH"),
        publicRefreshKey: loadKeyFromFile("REFRESH_PUBLIC_KEY_PATH"),
    };
}
