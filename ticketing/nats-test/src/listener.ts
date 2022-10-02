import { randomBytes } from "crypto";
import nats, { Message } from "node-nats-streaming";
import { validateLocaleAndSetLanguage } from "typescript";

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

  const options = stan.subscriptionOptions().setManualAckMode(true); // 306: Manual Ack Mode

  const subscription = stan.subscribe(
    "ticket:created",
    "orders-service-queue-group",
    options
  );

  subscription.on("message", (msg: Message) => {
    const data = msg.getData();

    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()}, with data: ${data} `);
    }

    msg.ack();
  });
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
