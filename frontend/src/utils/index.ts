import { Message, User} from "@/types";
import { io, Socket } from "socket.io-client";

let socket: Socket | undefined;

export const getSocket = () => {
  if (!socket) {
    socket = io("http://localhost:5580", { autoConnect: false });
  }
  return socket;
};

export function handleAuthSocket(username: string, socket: Socket) {
  if (!socket) return;

  if (!socket.connected) {
    if (!username || username.trim().length < 1) return;
    socket.auth = { username };
    socket.connect();
  } else {
    socket.disconnect();
  }
}

export function handleSendMessage(messageObj: Message, socket: Socket) {
  socket.emit("message", { messageObj });
}

export async function handleLogin({username, password}: Omit<User, "firstname"| "lastname"| "email">) {  
  try{
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/signin`, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    })

    if(!response.ok){
      throw new Error("Error: Failed to connect")
    }

    const data = await response.json()

    if(!data.success){
      throw new Error(data.statusMessage)
    }

   return data
  }catch(error){
    throw new Error(error)
  }
}

export async function handleLogout() {
  try{
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/signout`, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({})
    })

    if(!response.ok){
      throw new Error("Error: Failed to disconnect")
    }

    const data = await response.json()

    if(!data.success){
      throw new Error(data.statusMessage)
    }

   return data
  }catch(error){
    throw new Error(error)
  }
}