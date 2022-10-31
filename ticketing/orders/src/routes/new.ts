import mongoose, { mongo } from "mongoose";
import {
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@mcreservations/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/tickets";

const router = express.Router();

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
    res.send({});
  }
);

export { router as newOrderRouter };
