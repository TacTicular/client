import { useState, useEffect } from "react";
import socket from "../socket";
import Board from "../components/Board";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTheme } from "../contexts/ThemeContexts";

export default function Play() {
  const navigate = useNavigate();
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const [player, setPlayer] = useState("");
  const [usernames, setUsernames] = useState({});
  const { currentTheme, theme } = useTheme();
  const [playerCount, setPlayerCount] = useState(0);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    socket.on("playerCount", (count) => {
      setPlayerCount(count);
    });

    return () => {
      socket.off("playerCount");
    };
  }, []);

  useEffect(() => {
    socket.on("invalidRoom", (message) => {
      Swal.fire({
        icon: "error",
        title: "Invalid Room",
        text: message,
      });
    });

    return () => {
      socket.off("invalidRoom");
    };
  }, []);

  const joinRoom = () => {
    if (!room) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter a room!",
      });
    }

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
        Swal.fire({
          icon: "error",
          title: message + " !",
          text: "Please enter other rooms",
        });
      });
    }
  };

  function handleUsername() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div
      className={`${theme[currentTheme].background} ${theme[currentTheme].text} flex flex-col items-center justify-center min-h-screen p-6`}
    >
      {!connected ? (
        <div
          className={`${theme[currentTheme].button} w-full max-w-md p-6 bg-white rounded-lg shadow-lg text-center`}
        >
          <h2 className="text-2xl font-semibold text-purple-600 mb-4">
            Hi {username}! Please enter room
          </h2>
          <input
            type="text"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="4-digit number"
            className={`w-full p-3 border-2 border-gray-300 rounded-lg mb-4 text-lg text-center 
    ${theme[currentTheme].text} ${
              currentTheme === "dark" ? "text-gray-900" : ""
            }`}
          />

          <button
            onClick={joinRoom}
            className="pb-3 w-full py-3 bg-yellow-300 text-black font-semibold rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300"
          >
            Join
          </button>
          <button
            onClick={handleUsername}
            className="mt-2 w-full py-3 bg-red-400 text-black font-semibold rounded-lg shadow-lg hover:bg-red-500 transition duration-300"
          >
            Change Username
          </button>
        </div>
      ) : playerCount < 2 ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-opacity-50"></div>
          <div className="text-xl text-gray-500 mb-2">
            Waiting for opponents...
          </div>
        </div>
      ) : (
        <div
          className={`${theme[currentTheme].button} w-full max-w-md p-6 bg-white rounded-lg shadow-lg text-center`}
        >
          <h2 className="text-3xl font-semibold text-purple-600 mb-2">
            Room: <span className="font-medium text-blue-600">{room}</span>
          </h2>
          <h3
            className={`text-xl mb-4 ${
              currentTheme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Player: {username}, as{" "}
            <span className="font-medium text-blue-600">({player})</span>
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
