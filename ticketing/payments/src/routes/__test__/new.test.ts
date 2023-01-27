import request from "supertest";
import { app } from "../../app";

it("return a 404 when purchasing an order that does not exists", async () => {
  await request(app).post("/api/payments").set("Cookie", global.signup());
});
it("return a 401 when purchasing an order that doesnt belong to the user ", async () => {});
it("return a 400 when purchasing a cancelled order", async () => {});
