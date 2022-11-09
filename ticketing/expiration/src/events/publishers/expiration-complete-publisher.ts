import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from "@mcreservations/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
