"use client";

import { Message } from "@/types";
import { socket } from "@/utils";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  socket.on("connect", () => {
    console.log(socket.connected);
    setIsConnected(socket.connected);
  });

  socket.on("disconnect", () => {
    console.log(socket.connected);
    setIsConnected(socket.connected);
  });

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
      console.log("data", data);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  return (
    <main className="h-screen flex justify-center items-center font-[family-name:var(--font-geist-sans)]">
      <div className="border border-gray-300 h-full max-h-[600px] w-[900px] rounded grid grid-cols-4">
        <div className="border-r border-gray-300 flex flex-col justify-between">
          <div className="p-4">
            <input
              type="text"
              placeholder="Entrez votre nom d'utilisateur"
              className="w-full px-2 py-1.5 text-sm border rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <button
            className="w-full py-5 hover:bg-[rgba(255,255,255,0.05)] cursor-pointer"
            onClick={() => handleAuth(username)}
          >
            {isConnected ? "Déconnecter" : "Connecter"}
          </button>
        </div>
        <div className="h-full max-h-[600px] col-span-3 flex flex-col justify-between p-5 gap-5">
          <div className="overflow-y-auto flex flex-col gap-4">
            {messages && messages.length > 0
              ? messages.map((msg: Message, i: number) => {
                  return (
                    <div
                      key={i}
                      className={`w-full flex ${
                        msg.self ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`rounded px-2.5 py-1.5 min-w-[100px] ${
                          msg.self
                            ? "bg-green-500 text-right"
                            : "bg-blue-500 text-left"
                        }`}
                      >
                        <span className="font-bold text-xs">{msg.from}</span>
                        <p className="text-sm">{msg.message}</p>
                        <span className="text-[8px]">{msg.timestamp}</span>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
          <div className="border border-gray-300 rounded flex h-fit">
            <input
              type="text"
              className="outline-none w-full px-2 py-1.5 text-sm"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            <button
              className="text-sm px-3 py-1.5 cursor-pointer hover:bg-[rgba(255,255,255,0.05)]"
              onClick={() => {
                setMessages((prev) => [
                  ...prev,
                  {
                    message,
                    to: "room1",
                    from: "Me",
                    self: true,
                    timestamp: new Date().toLocaleTimeString(),
                  },
                ]);
                handleSendMessage({
                  message,
                  to: "room1",
                  timestamp: new Date().toLocaleTimeString(),
                  from: "Me",
                });
                setMessage("");
              }}
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function handleAuth(username: Partial<string>) {
  if (!socket) return;

  if (!socket.connected) {
    if (!username || username.length < 1) return;
    socket.auth = { username };
    socket.connect();
  } else {
    socket.disconnect();
  }
}

function handleSendMessage(messageObj: Message) {
  socket.emit("message", { messageObj });
}
