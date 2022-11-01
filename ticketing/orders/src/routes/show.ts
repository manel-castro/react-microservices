import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@mcreservations/common";
import express, { NextFunction, Request, Response } from "express";
import { Order } from "../models/order";

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");

    if (!order) {
      next(new NotFoundError());
      return;
    }

    if (order.userId !== req.currentUser!.id) {
      next(new NotAuthorizedError());
      return;
    }

    res.send(order);
  }
);

export { router as showOrderRouter };
