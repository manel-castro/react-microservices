import { Subjects, Listener, TicketUpdatedEvent } from "@mcreservations/common";
import { Message } from "node-nats-streaming";
import { validateLocaleAndSetLanguage } from "typescript";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { id, title, price } = data;

    const ticket = await Ticket.findByEvent({
      id: data.id,
      version: data.version,
    });

    if (!ticket) {
      throw new Error("Ticket not found");
    }
    console.log("Ticket found in orders update");

    ticket.set({ title, price });

    await ticket.save();

    msg.ack();
  }
}
