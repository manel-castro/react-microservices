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

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true) // 306: Manual Ack Mode
    .setDeliverAllAvailable() // recovers all events on restart listener
    /**
     * .setDurableName
     * asap some event is processed successfully (acknolwedged) it's saved in durable subscriptions
     * IF event turns offline, also saved events that were not processed successfully
     * when comes back online service with mathing ID, NATS server will forward events not processed to service
     *
     * * We need setDeliverAllAvailable for the first time when bringing service up online; Otherwise events received while service was online will be just lost
     *
     * * We yet need a queue-group-name as described below. If listner goes offline, NATS will automaticaly remove any DurableName. By adding it, it will preserve it.
     */
    .setDurableName("accounting-service");

  const subscription = stan.subscribe(
    "ticket:created",
    "queue-group-name",
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
