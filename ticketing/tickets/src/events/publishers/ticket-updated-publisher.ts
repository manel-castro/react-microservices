import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@mcreservations/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
