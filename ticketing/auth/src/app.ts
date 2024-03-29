import express from "express";
import { json } from "body-parser";

import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler, NotFoundError } from "@mcreservations/common";

import { validateLocaleAndSetLanguage } from "typescript";

const app = express();
app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false && process.env.NODE_ENV !== "test", // test run in plain HTTP, not HTTPS // TODO: enable this
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.get("*", async (req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export { app };
