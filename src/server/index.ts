import express from "express";

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello world" });
});

const start = async () => {
  try {
    app.listen(port, () => {
      console.log("Server started at port", port);
    });
  } catch (err) {
    console.error("Server failed to start:", err);
  }
};

start();
