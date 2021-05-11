import { Listener, Subjects, TicketUpdatedEvent } from "@vladtickets/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { id, title, price, version } = data;

    const ticket = await Ticket.findOne({
      _id: id,
      version: version - 1,
    });

    if (!ticket) {
      throw new Error("Ticket now found");
    }

    ticket.set({ title, price });

    await ticket.save();

    msg.ack();
  }
}
