import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const Cell = ({ value, onClick, isOpponentTurn }) => {
  return (
    <button
      onClick={onClick}
      className={`w-16 h-16 flex justify-center items-center text-2xl border-2 rounded-md
        ${isOpponentTurn ? "bg-gray-700" : value ? "bg-gray-300" : "bg-white"} 
        cursor-${isOpponentTurn ? "not-allowed" : "pointer"} 
        hover:bg-blue-100 transition-all duration-200 ease-in-out`}
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

    return () => {
      socket.off("assignPlayer");
      socket.off("updateBoard");
    };
  }, [socket]);

  const resetGame = () => {
    socket.emit("reset", room);
    Swal.close(); // Menutup dialog jika reset dilakukan
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
        text: `Pemenang: ${usernames[winner]} (${winner})`,
        icon: "success",
        confirmButtonText: "Reset Game",
        allowOutsideClick: false,
      }).then(() => resetGame());
    } else if (draw) {
      Swal.fire({
        title: "Game Over",
        text: "Hasil: Seri!",
        icon: "info",
        confirmButtonText: "Reset Game",
        allowOutsideClick: false,
      }).then(() => resetGame());
    }
  }, [winner, draw, usernames]);

  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-t from-purple-500 via-blue-400 to-purple-300 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-4 text-white">
        {!winner && !draw && currentTurn !== player && (
          <h3 className="text-xl text-gray-100 mb-2">
            {opponentUsername ? (
              `Your opponent's turn`
            ) : (
              <span className="text-yellow-400">Waiting for opponents...</span>
            )}
          </h3>
        )}
        {winner
          ? `Pemenang: ${usernames[winner]} (${winner})`
          : draw
          ? "Hasil: Seri!"
          : `${
              usernames[currentTurn] ? usernames[currentTurn] : "Player"
            }'s turn`}
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

      {/* {(winner || draw) && (
        <button
          onClick={resetGame}
          className="mt-4 py-2 px-6 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition duration-300 ease-in-out"
        >
          Reset Game
        </button>
      )} */}
    </div>
  );
};

export default Board;
