import express from "express";
import { Server } from "socket.io";
import cookieparser from "cookie-parser";
import { createServer } from "http";
import cors from "cors";

import { PORT } from "./config/env.js";
import connectToDatabase from "./config/database.js";
import authRouter from "./routes/auth.routes.js";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(cookieparser());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/auth", authRouter);

io.on("connection", (socket) => {
  let users = [];
  console.log(
    `User ${socket.id} / ${socket.handshake.auth.username} connected`
  );

  const sockets = io.of("/").sockets;
  for (const [id, currentSocket] of sockets) {
    users.push({
      userId: id,
      username: currentSocket.handshake.auth.username,
      connected: true,
    });
  }

  socket.emit("users", users);

  socket.on("message", (data) => {
    let content = { ...data.messageObj };
    content.from = socket.handshake.auth.username;

    console.log("Message reçu:", content);
    socket.broadcast.emit("message", content);
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);

    for (let i = 0; i < users.length; i++) {
      if (users[i].userId == socket.id) {
        users[i].connected = false;
        break;
      }
    }

    socket.broadcast.emit("users", users);
  });
});

httpServer.listen(PORT, async () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  await connectToDatabase();
});
