import express from "express";
import { json } from "body-parser";

import cookieSession from "cookie-session";

import { errorHandler, NotFoundError } from "@mcreservations/common";

import { validateLocaleAndSetLanguage } from "typescript";

const app = express();
app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test", // test run in plain HTTP, not HTTPS
  })
);

app.get("*", async (req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export { app };
