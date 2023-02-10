import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  console.log("Sarting...");

  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI); // /auth create automatically this DB}
    console.log("Connected to mongodb");
  } catch (e) {
    console.error(e);
  }
  app.listen(3000, () => {
    console.log("Auth listening on port 3000");
  });
};

start();
