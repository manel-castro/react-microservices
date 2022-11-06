import { Ticket } from "../tickets";

it("implements optimistic concurrency control", async () => {
  /**
   * Is not testing a real life scenario, but just a concurrency issue
   */

  // Create an instance of a ticket

  const ticket = Ticket.build({
    title: "concert",
    price: 5,
    userId: "123",
  });

  // Save ticket to the database: version number = 0

  await ticket.save();

  // Fetch ticket twice

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // Make two separate changes to the tickets we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  // Save the first fetched ticket: should work, version number = 1
  await firstInstance!.save();

  // Save the second fetched ticket, expect error: outdated version number
  try {
    await secondInstance!.save();
  } catch (e) {
    return;
  }

  throw new Error("Should nto reach this point");

  // expect(async () => {
  //   await secondInstance!.save();

  // }).toThrow() // ts issues
});

it("increments the version number on multiple saves", async () => {
  const ticket = Ticket.build({
    title: "concer",
    price: 10,
    userId: "123",
  });

  await ticket.save();

  expect(ticket.version).toEqual(0);

  await ticket.save();

  expect(ticket.version).toEqual(0);

  await ticket.set({
    price: 11,
  });
  await ticket.save();

  expect(ticket.version).toEqual(1);
});
