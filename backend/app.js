import express from "express";
import { Server } from "socket.io";
import cookieparser from "cookie-parser";

import { PORT } from "./config/env.js";
import connectToDatabase from "./config/database.js";
import authRouter from "./routes/auth.routes.js";

const app = express();

app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/auth", authRouter);

const expressServer = app.listen(PORT, async () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  await connectToDatabase();
});

const io = new Server(expressServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log(
    `User ${socket.id} / ${socket.handshake.auth.username} connected`
  );

  socket.on("message", (data) => {
    let content = { ...data.messageObj };
    content.from = socket.handshake.auth.username;

    console.log("Message reçu:", content);
    socket.broadcast.emit("message", content);
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});
