import { Message, Stan } from "node-nats-streaming";

export abstract class Listener {
  abstract subject: string;
  abstract queueGroupName: string;
  abstract onMessage(data: any, msg: Message): void;
  private client: Stan;
  protected ackWait = 5 * 1000; // protected: sublcass can declare if it wants too

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return (
      this.client
        .subscriptionOptions()
        .setManualAckMode(true) // 306: Manual Ack Mode
        .setAckWait(this.ackWait)
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
        .setDurableName(this.queueGroupName)
    ); // usually the same
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8")); //is buffer
  }
}
