import { createApp } from "./app";
import { runMigrations } from "./database";

const app = createApp("test");
const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await runMigrations();
        app.listen(port, () => {
            console.log("Server started at port", port);
        });
    } catch (err) {
        console.error("Server failed to start:", err);
    }
};

start();
