import { requireAuth, validateRequest } from "@mcreservations/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/tickets";

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

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
