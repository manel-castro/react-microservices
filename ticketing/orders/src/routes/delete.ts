import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from "@mcreservations/common";
import express, { NextFunction, Request, Response } from "express";
import { Order } from "../models/order";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
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

    order.status = OrderStatus.Cancelled;
    await order.save();

    // Pub event saying this was cancelled

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
