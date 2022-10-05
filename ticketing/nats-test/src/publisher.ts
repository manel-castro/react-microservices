import { StandardValidation } from "express-validator/src/context-items";
import nats, { Stan } from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();
// in docs usually "stan" but it's the client
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  const publisher = new TicketCreatedPublisher(stan);

  try {
    await publisher.publish({
      id: "123",
      title: "concert",
      price: 20,
    });
  } catch (e) {
    console.error(e);
  }
  // console.log("Publisher connected to NATS");

  // const data = JSON.stringify({
  //   id: "123",
  //   title: "concert",
  //   price: 20,
  // });

  // // events===message
  // stan.publish("ticket:created", data, () => {
  //   console.log("Event published");
  // });
});
