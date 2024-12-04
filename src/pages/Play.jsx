import { useState } from "react";
import socket from "../socket";
import Board from "./Board";

export default function Play() {
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const [player, setPlayer] = useState("");
  const [usernames, setUsernames] = useState({});

  const joinRoom = () => {
    if (room && username) {
      socket.connect();
      socket.emit("joinRoom", { room, username });

      socket.on(
        "assignPlayer",
        ({ player: assignedPlayer, usernames: roomUsernames }) => {
          setPlayer(assignedPlayer);
          setUsernames(roomUsernames);
          setConnected(true);
        }
      );

      socket.on("roomFull", (message) => {
        alert(message);
      });
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {!connected ? (
        <div>
          <h2>Masukkan Nama Ruangan dan Username</h2>
          <input
            type="text"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Nama Ruangan"
            style={{
              padding: "10px",
              fontSize: "16px",
              marginBottom: "10px",
            }}
          />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            style={{
              padding: "10px",
              fontSize: "16px",
              marginBottom: "10px",
            }}
          />
          <button
            onClick={joinRoom}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#646cff",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Bergabung
          </button>
        </div>
      ) : (
        <div>
          <h2>Ruangan: {room}</h2>
          <h3>
            Anda adalah pemain: {username} ({player})
          </h3>
          <Board
            socket={socket}
            room={room}
            player={player}
            usernames={usernames}
          />
        </div>
      )}
    </div>
  );
}
