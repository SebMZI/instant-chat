import express from "express";
import cookieparser from "cookie-parser";
import { PORT } from "./config/env.js";
import connectToDatabase from "./config/database.js";
import authRouter from "./routes/auth.routes.js";

const app = express();
app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);

app.listen(PORT, async () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  await connectToDatabase();
});
