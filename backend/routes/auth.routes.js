import { Router } from "express";
import { signin, signout, signup } from "../controllers/auth.controllers.js";
import arcjetMiddleware from "../middlewares/arcjet.middleware.js";

const authRouter = Router();

authRouter.post("/signup", arcjetMiddleware, signup);
authRouter.post("/signin", arcjetMiddleware, signin);
authRouter.post("/signout", arcjetMiddleware, signout);

export default authRouter;
