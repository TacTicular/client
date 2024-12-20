import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useTheme } from "../contexts/ThemeContexts";

const Cell = ({ value, onClick, isOpponentTurn }) => {
  const { currentTheme, theme } = useTheme();

  return (
    <button
      onClick={onClick}
      className={`w-16 h-16 flex justify-center items-center text-2xl border-2 rounded-md
      ${isOpponentTurn ? "bg-gray-700" : value ? "bg-gray-300" : "bg-white"} 
      cursor-${isOpponentTurn ? "not-allowed" : "pointer"} 
      hover:bg-blue-100 transition-all duration-200 ease-in-out
      ${theme[currentTheme].button}`}
      disabled={isOpponentTurn}
    >
      {value}
    </button>
  );
};

const Board = ({ socket, room, player }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState("X");
  const [usernames, setUsernames] = useState({});
  const { currentTheme, theme } = useTheme();

  const handleClick = (index) => {
    if (board[index] || currentTurn !== player) return;

    const newBoard = [...board];
    newBoard[index] = player;

    socket.emit("move", { board: newBoard, room, player });
  };

  useEffect(() => {
    socket.on("assignPlayer", ({ player, usernames: assignedUsernames }) => {
      setUsernames(assignedUsernames);
    });

    socket.on(
      "updateBoard",
      ({
        board: newBoard,
        currentTurn: newTurn,
        usernames: updatedUsernames,
      }) => {
        setBoard(newBoard);
        setCurrentTurn(newTurn);
        if (updatedUsernames) {
          setUsernames(updatedUsernames);
        }
      }
    );

    socket.on("playerDisconnected", (message) => {
      Swal.fire({
        icon: "warning",
        title: "Player Disconnected",
        text: message,
      });
    });

    return () => {
      socket.off("assignPlayer");
      socket.off("updateBoard");
      socket.off("playerDisconnected");
    };
  }, [socket]);

  const resetGame = () => {
    socket.emit("reset", room);
    Swal.close();
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(board);
  const draw = !winner && board.every((cell) => cell !== null);
  const isOpponentTurn = currentTurn !== player;

  const opponentUsername = usernames[player === "X" ? "O" : "X"];

  useEffect(() => {
    if (winner) {
      Swal.fire({
        title: "Game Over",
        text: `Winner: ${usernames[winner]} (${winner})`,
        icon: "success",
        confirmButtonText: "Reset Game",
        allowOutsideClick: false,
      }).then(() => resetGame());
    } else if (draw) {
      Swal.fire({
        title: "Game Over",
        text: "Result: draw!",
        icon: "info",
        confirmButtonText: "Reset Game",
        allowOutsideClick: false,
      }).then(() => resetGame());
    }
  }, [winner, draw, usernames]);

  return (
    <div
      className={`flex flex-col items-center p-6 rounded-lg shadow-lg w-full max-w-md ${theme[currentTheme].background} ${theme[currentTheme].text}`}
    >
      <h2 className="text-2xl font-semibold mb-4">
        {winner && (
          <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-purple-500 text-transparent bg-clip-text font-bold">
            Winner: {usernames[winner]} ({winner})
          </span>
        )}
        {!winner && draw && (
          <span className="text-pink-400 font-bold">Result: Draw!</span>
        )}
        {!winner && !draw && (
          <h3 className="text-xl mb-2">
            {currentTurn === player ? (
              <span className="text-orange-500 font-bold animate-pulse">
                Your turn
              </span>
            ) : opponentUsername ? (
              <span className="text-blue-500 font-semibold">
                Your opponent's turn
              </span>
            ) : (
              <span className="text-red-400 font-semibold animate-bounce">
                Waiting for opponents...
              </span>
            )}
          </h3>
        )}

        {!winner && !draw && (
          <span className="text-gray-100">
            {currentTurn === player
              ? `${usernames[player] ? usernames[player] : "Player"}'s turn`
              : `${
                  usernames[currentTurn] ? usernames[currentTurn] : "Other"
                }'s turn`}
          </span>
        )}
      </h2>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {board.map((cell, index) => (
          <Cell
            key={index}
            value={cell}
            onClick={() => handleClick(index)}
            isOpponentTurn={isOpponentTurn}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
