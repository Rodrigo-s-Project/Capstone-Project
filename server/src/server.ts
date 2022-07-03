import express from "express";
import cors from "cors";

export const app = express();

app.set("port", process.env.PORT);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true
  })
);

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.use(express.json());
