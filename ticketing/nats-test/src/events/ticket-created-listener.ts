import { Message } from "node-nats-streaming";
import { validateLocaleAndSetLanguage } from "typescript";

import { TicketCreatedEvent, Subjects, Listener } from "@mcreservations/common";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated; //!!!! special usage of ENUM requires types
  queueGroupName = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log("Event data!", data);

    msg.ack();
  }
}
