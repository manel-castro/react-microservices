import { Message } from "node-nats-streaming";
import { validateLocaleAndSetLanguage } from "typescript";
import { Listener } from "./base-listener";

export class ThicketCreatedListener extends Listener {
  subject = "ticket:created";
  queueGroupName = "payments-service";

  onMessage(data: any, msg: Message) {
    console.log("Event data!", data);

    msg.ack();
  }
}
