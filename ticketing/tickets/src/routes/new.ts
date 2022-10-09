import { requireAuth, validateRequest } from "@mcreservations/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { Ticket } from "../models/tickets";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    // it will include an error to the validation request
    body("title").not().isEmpty(), // both not provided and ""
    body("price")
      .isFloat({
        gt: 0, // greater than
      })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { price, title } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id, // require auth
    });

    await ticket.save();

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title, // title might not be the same since in Mongoose we can do some presave hooks
      price: ticket.price,
      userId: ticket.userId,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
