"use client";
import { Message } from "@/types";
import { useState, useEffect } from "react";
import {
  getSocket,
  handleAuthSocket,
  handleLogin,
  handleLogout,
  handleSendMessage,
} from "@/utils";
import Modal from "@/components/Modal";

export default function Home() {
  const socket = getSocket();
  const [users, setUsers] = useState<
    { userId: string; username: string; connected: boolean; self: boolean }[]
  >([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleDisconnect = () => {
      console.log("Déconnecté :", socket.connected);
      setIsConnected(socket.connected);
      setMessages([]);
      setUsers([]);
    };

    const handleMessage = (data: Message) => {
      setMessages((prev) => [...prev, data]);
      console.log("Message reçu :", data);
    };

    const handleUsers = (data: {
      [key: string]: {
        userId: string;
        username: string;
        connected: boolean;
        self: boolean;
      };
    }) => {
      if (!data) return;
      console.log("USERS", data);
      const newUsers = Object.values(data).filter(Boolean);
      setUsers(newUsers);
    };

    socket.on("users", handleUsers);
    socket.on("disconnect", handleDisconnect);
    socket.on("message", handleMessage);

    socket.on("connect", () => {
      console.log("Connecté :", socket.id);
      setIsConnected(true);
    });

    return () => {
      socket.off("disconnect", handleDisconnect);
      socket.off("message", handleMessage);
      socket.off("users", handleUsers);
    };
  }, [socket]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const username = (form.elements.namedItem("username") as HTMLInputElement)
      .value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    if (!username || !password || username.length < 1 || password.length < 1)
      return;

    const data = await handleLogin({ username, password });

    if (data.success) {
      setIsModalOpen(false);
      setIsConnected(true);
      handleAuthSocket(username, socket);
    }
    console.log(data);
  }

  async function handleDisconnect() {
    const data = await handleLogout();

    if (!data.success) return;
    setIsConnected(false);
    socket.disconnect();
  }

  return (
    <main className="h-screen flex justify-center items-center font-[family-name:var(--font-geist-sans)]">
      <div className="border border-gray-300 h-full max-h-[600px] w-[900px] rounded grid grid-cols-4">
        {isModalOpen ? (
          <Modal close={() => setIsModalOpen(false)}>
            <div>
              <h2 className="text-center font-medium text-xl">Sign In</h2>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 my-5"
              >
                <div className="flex flex-col gap-0.5">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    className="border border-[rgba(0,0,0,0.35)] outline-none rounded px-2 py-1"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="border border-[rgba(0,0,0,0.35)] outline-none rounded px-2 py-1"
                  />
                </div>
                <p></p>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-500 text-white rounded cursor-pointer"
                >
                  Login
                </button>
              </form>
              <p className="text-center text-xs">No account yet? Sign Up</p>
            </div>
          </Modal>
        ) : null}
        <div className="border-r border-gray-300 flex flex-col justify-between">
          <ul>
            {users && users.length > 0
              ? users.map(
                  (
                    user: {
                      userId: string;
                      username: string;
                      connected: boolean;
                    },
                    i
                  ) =>
                    user.userId !== socket.id ? (
                      <li
                        key={i}
                        className="px-5 py-2.5 hover:bg-[rgba(255,255,255,0.05)] cursor-pointer"
                      >
                        <p className="font-semibold">{user.username}</p>
                        <div className="flex gap-1.5 items-center my-0.5">
                          <span
                            className={`h-2 w-2 ${
                              !user.connected ? "bg-orange-500" : "bg-green-500"
                            } rounded-full`}
                          ></span>
                          <p className="text-xs">
                            {!user.connected ? "Disconnected" : "Connected"}
                          </p>
                        </div>
                      </li>
                    ) : null
                )
              : null}
          </ul>
          <button
            className="w-full py-5 hover:bg-[rgba(255,255,255,0.05)] cursor-pointer"
            onClick={() =>
              !isConnected ? setIsModalOpen(true) : handleDisconnect()
            }
          >
            {isConnected ? "Log Out" : "Log In"}
          </button>
        </div>
        <div className="h-full max-h-[600px] col-span-3 flex flex-col justify-between p-5 gap-5">
          <div className="overflow-y-auto flex flex-col gap-4">
            {messages.map((msg: Message, i: number) => (
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
            ))}
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
              disabled={!isConnected}
              onClick={() => {
                const messageObj: Message = {
                  message,
                  to: "room1",
                  from: "Me",
                  self: true,
                  timestamp: new Date().toLocaleTimeString(),
                };
                handleSendMessage({ ...messageObj, self: undefined }, socket);
                setMessages((prev) => [...prev, messageObj]);
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
