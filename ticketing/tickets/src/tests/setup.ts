import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import { app } from "../app";
import request from "supertest";
import jwt from "jsonwebtoken";

declare global {
  var signup: () => string[];
}

jest.mock("../nats-wrapper"); // redirect imports made in jest to __mocks__

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "asdafg";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks(); // so that mocks are not polluted between tests
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signup = () => {
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "some@email.test",
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = { jwt: token };

  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`session=${base64}`];
};
