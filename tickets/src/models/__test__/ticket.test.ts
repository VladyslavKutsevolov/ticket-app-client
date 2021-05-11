import { Ticket } from "../ticket";

it("should implements Optimistic Concurrency Control", async (done) => {
  const ticket = Ticket.build({
    title: "one",
    price: 20,
    userId: "123",
  });

  await ticket.save();

  const instance1 = await Ticket.findById(ticket.id);
  const instance2 = await Ticket.findById(ticket.id);

  instance1!.set({ price: 5 });
  instance2!.set({ price: 50 });

  await instance1!.save();

  try {
    await instance2!.save();
  } catch (e) {
    return done();
  }

  throw new Error("should not come to this point");
});
