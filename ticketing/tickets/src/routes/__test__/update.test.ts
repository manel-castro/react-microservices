import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";

it("returns a 404 if the provided id doesn't exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signup())
    .send({ title: "asdf", price: 20 })
    .expect(404);
});
it("returns a 401 if the user is not auth", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    // .set("Cookie", global.signup())
    .send({ title: "asdf", price: 20 })
    .expect(401);
});
it("returns a 401 if the user doesn't own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({ title: "asdge", price: 10 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    // will generate a different id
    .set("Cookie", global.signup())
    .send({ title: "aaaaa", price: 1000 })
    .expect(401);
});
it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = global.signup();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "asdge", price: 10 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    // will generate a different id
    .set("Cookie", global.signup())
    .send({ title: "", price: 20 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    // will generate a different id
    .set("Cookie", global.signup())
    .send({ title: "asd", price: -20 })
    .expect(400);
});
it("updates the ticket providing valid inputs", async () => {
  const cookie = global.signup();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "asdge", price: 10 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    // will generate a different id
    .set("Cookie", cookie)
    .send({ title: "new title", price: 20 })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual("new title");
  expect(ticketResponse.body.price).toEqual(20);
});

it("publishes an event", async () => {
  const cookie = global.signup();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "asdge", price: 10 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    // will generate a different id
    .set("Cookie", cookie)
    .send({ title: "new title", price: 20 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled(); // test mock functions
});
