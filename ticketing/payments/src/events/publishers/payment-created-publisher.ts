import {
  Publisher,
  Subjects,
  PaymentCreatedEvent,
} from "@mcreservations/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
