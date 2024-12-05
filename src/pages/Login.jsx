import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTheme } from "../contexts/ThemeContexts";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const { currentTheme, theme } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username) {
      Swal.fire({
        icon: "error",
        title: "Name is required!",
        text: "Please enter your name",
      });
    }

    localStorage.setItem("username", username);
    navigate("/play");
  };

  return (
    <div
      className={`${theme[currentTheme].background} ${theme[currentTheme].text} flex-1 flex flex-col items-center justify-center h-screen`}
    >
      <div className="w-full max-w-xs">
        <form
          onSubmit={handleSubmit}
          className={`${theme[currentTheme].button} shadow-lg rounded-lg px-8 pt-6 pb-8 border-4 border-orange-300`}
        >
          <h1 className="text-4xl text-center font-extrabold mb-4">
            Tac<span className="text-yellow-300">Ticular</span>
          </h1>
          <input
            name="username"
            type="text"
            className="shadow appearance-none border-2 border-orange-400 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-300 mb-6 text-center text-lg"
            placeholder="Enter your name..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            className="w-full bg-orange-500 hover:bg-red-500 text-white font-extrabold py-3 px-4 rounded focus:outline-none focus:ring-4 focus:ring-red-300 text-lg"
            type="submit"
          >
            Start Game
          </button>
        </form>
      </div>
    </div>
  );
}
