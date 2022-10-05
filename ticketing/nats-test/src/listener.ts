import { randomBytes } from "crypto";
import nats from "node-nats-streaming";
import { ThicketCreatedListener } from "./events/ticket-created-listener";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed!");
    //(listening signals below) exit program entirely:
    process.exit();
  });

  new ThicketCreatedListener(stan).listen();
});

/**
 * These signals listen for interrupts like Ctrl+C  (windows signals might differ)
 * * * If process killed won't listen: we'll need heartbeat mechanism
 * This is made to exit subscriptions when interrupts
 * http://localhost:8222/streaming/channelsz?subs=1 (monitoring server)
 *
 */
process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
