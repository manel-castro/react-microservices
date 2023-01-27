import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@mcreservations/common";
import express, { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";

import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { natsWrapper } from "../nats-wrapper";
import { stripe } from "../stripe";

const router = express.Router();
//  while stripe account is in testmode we can use the test mode token: "tok_visa"
// we need the K8S secret to be configured with our private key
router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    // Checks
    if (!order) {
      next(new NotFoundError());
      return;
    }
    if (order.userId !== req.currentUser!.id) {
      next(new NotAuthorizedError());
      return;
    }
    if (order.status === OrderStatus.Cancelled) {
      next(new BadRequestError("Cannot pay for an cancelled order"));
      return;
    }

    const charge = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100, // in cents
      source: token,
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });

    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      //  could come from request, but best from last record in DDBB
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
