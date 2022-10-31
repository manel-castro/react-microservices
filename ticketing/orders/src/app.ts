import express from "express";
import { json } from "body-parser";

import cookieSession from "cookie-session";

import {
  currentUser,
  errorHandler,
  NotFoundError,
} from "@mcreservations/common";

import { validateLocaleAndSetLanguage } from "typescript";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { indexOrderRouter } from "./routes";
import { deleteOrderRouter } from "./routes/delete";

const app = express();
app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({
    //this is to set req.session
    signed: false,
    secure: process.env.NODE_ENV !== "test", // test run in plain HTTP, not HTTPS
  })
);

app.use(currentUser); // for all routes to know if it's auth

app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.get("*", async (req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export { app };