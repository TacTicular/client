import { useState, useEffect } from "react";
import socket from "../socket";

export default function Play() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.auth = {
      username: localStorage.username,
    };
    socket.connect();

    socket.on("users:online", (onlineUsers) => {
      setUsers(onlineUsers);
    });

    return () => {
      socket.off("users:online");
      socket.disconnect();
    };
  }, []);

  console.log(users)


  return <div>test</div>;
}
