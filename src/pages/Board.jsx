import { useState, useEffect } from "react";

const Cell = ({ value, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: "60px",
        height: "60px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "24px",
        border: "1px solid #000",
      }}
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

    socket.on("updateBoard", ({ board: newBoard, currentTurn: newTurn, usernames: updatedUsernames }) => {
      setBoard(newBoard);
      setCurrentTurn(newTurn);
      if (updatedUsernames) {
        setUsernames(updatedUsernames);
      }
    });

    return () => {
      socket.off("assignPlayer");
      socket.off("updateBoard");
    };
  }, [socket]);

  const resetGame = () => {
    socket.emit("reset", room);
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
  return (
    <div>
      <h2>
        {winner
          ? `Pemenang: ${usernames[winner]} (${winner})`
          : draw
          ? "Hasil: Seri!"
          : `Giliran: ${usernames[currentTurn]} (${currentTurn})`}
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "5px",
        }}
      >
        {board.map((cell, index) => (
          <Cell key={index} value={cell} onClick={() => handleClick(index)} />
        ))}
      </div>
      {(winner || draw) && (
        <button
          onClick={resetGame}
          style={{
            marginTop: "10px",
            padding: "10px",
            fontSize: "16px",
            backgroundColor: "#646cff",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Reset Game
        </button>
      )}
    </div>
  );
};

export default Board; 

