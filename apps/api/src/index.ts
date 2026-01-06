import { createApp } from "./app";
import { initDb } from "./database";

const app = createApp();
const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await initDb();
        app.listen(port, () => {
            console.log("Server started at port", port);
        });
    } catch (err) {
        console.error("Server failed to start:", err);
    }
};

start();
