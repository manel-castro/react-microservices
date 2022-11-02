import { Publisher, OrderCreatedEvent, Subjects } from "@mcreservations/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
