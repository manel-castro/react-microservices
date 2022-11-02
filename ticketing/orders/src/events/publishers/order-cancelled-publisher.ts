import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from "@mcreservations/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
