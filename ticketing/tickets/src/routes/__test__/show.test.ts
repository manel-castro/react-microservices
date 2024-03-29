import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

it("returns a 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString(); // generate a valid mongoose id

  const response = await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404);
  // console.log(response.body);
  // expect(response.body);
});
it("returns the ticket is found", async () => {
  const title = "concert";
  const price = 20;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({ title, price })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
