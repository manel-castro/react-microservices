import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await natsWrapper.connect("ticketing", "lskdjg", "http://nats-srv:4222");

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      //(listening signals below) exit program entirely:
      process.exit();
    });
    /**
     * kubectl get pods
     * kubectl delete pod {pod id}
     */
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongodb");
  } catch (e) {
    console.error(e);
  }
  app.listen(3000, () => {
    console.log("Tickets listening on port 3000");
  });
};

start();
