import express, { NextFunction, Request, Response } from "express";
import { User } from "../models/user";

import jwt from "jsonwebtoken";

import { body } from "express-validator";
import { BadRequestError, validateRequest } from "@mcreservations/common";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new BadRequestError("Email in use"));
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // Store it on the session object
    req.session = { jwt: userJwt }; // redefine this obj because type definitions

    res.status(201).send(user);
  }
);

export { router as signupRouter };
