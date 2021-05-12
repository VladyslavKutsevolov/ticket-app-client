import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@vladtickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}