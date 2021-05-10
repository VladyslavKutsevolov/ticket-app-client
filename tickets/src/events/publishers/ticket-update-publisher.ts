import { Publisher, Subjects, TicketUpdatedEvent } from "@vladtickets/common";

export class TicketUpdatePublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
