import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth"); // /auth create automatically this DB}
    console.log("Connected to mongodb");
  } catch (e) {
    console.error(e);
  }
  app.listen(3000, () => {
    console.log("Auth listening on port 3000");
  });
};

start();
