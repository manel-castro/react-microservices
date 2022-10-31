import { NotFoundError } from "@mcreservations/common";
import express, { NextFunction, Request, Response } from "express";
import { Ticket } from "../models/tickets";

const router = express.Router();

router.get(
  "/api/orders",
  async (req: Request, res: Response, next: NextFunction) => {
    res.send({});
  }
);

export { router as indexOrderRouter };
