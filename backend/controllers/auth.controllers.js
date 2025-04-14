import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JWT_EXPIRES_IN, JWT_SECRET, NODE_ENV } from "../config/env.js";

export const signup = async (req, res, next) => {
  const session = await User.startSession();
  session.startTransaction();

  try {
    const { firstname, lastname, username, email, password } = req.body;

    const existingUsername = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingEmail || existingUsername) {
      const error = new Error("Username and Email must be unique");
      error.status = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create(
      {
        firstname,
        lastname,
        username,
        email,
        password: hashedPassword,
      },
      { session }
    );

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await session.commitTransaction();
    session.endSession();

    res.cookie("token", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
    });

    res.status(201).json({
      statusMessage: "User successfully created",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
