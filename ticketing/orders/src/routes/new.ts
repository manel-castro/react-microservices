import mongoose, { mongo } from "mongoose";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@mcreservations/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { natsWrapper } from "../nats-wrapper";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the ddbb
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      next(new NotFoundError());
      return;
    }

    // Make sure ticket is not already reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      next(new BadRequestError("Ticket is already reserved"));
      return;
    }

    // Calculate an expiration date for order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the ddbb
    const order = Order.build({
      expiresAt: expiration,
      status: OrderStatus.Created,
      ticket,
      userId: req.currentUser!.id,
    });
    await order.save();

    // Publish an event saying the order has been created

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
