import { StandardValidation } from "express-validator/src/context-items";
import nats, { Stan } from "node-nats-streaming";

console.clear();
// in docs usually "stan" but it's the client
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Publisher connected to NATS");

  const data = JSON.stringify({
    id: "123",
    title: "concert",
    price: 20,
  });

  // events===message
  stan.publish("ticket:created", data, () => {
    console.log("Event published");
  });
});
