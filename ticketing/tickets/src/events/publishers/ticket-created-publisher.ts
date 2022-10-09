import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@mcreservations/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
