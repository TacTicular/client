import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContexts";

export default function Home() {
  const { currentTheme, theme } = useTheme();

  return (
    <div
      className={`${theme[currentTheme].background} ${theme[currentTheme].text} flex flex-col items-center justify-center min-h-screen`}
    >
      <header className="text-center mb-10">
        <h1 className="text-6xl font-extrabold mb-4">
          Welcome to{" "}
          <span
            className={`${
              currentTheme === "light"
                ? "text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600"
                : "text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-400 to-pink-500"
            }`}
          >
            TacTicular
          </span>
          !
        </h1>
        <p className="text-lg max-w-2xl">
          Get ready to play the ultimate Tic-Tac-Toe experience! Challenge your
          skills, outsmart your opponents, and become the champion in this
          classic yet exciting game.
        </p>
      </header>

      <div className="mb-10">
        <img
          src="/logo.png"
          alt="Game Logo"
          className="w-40 h-40 rounded-full shadow-lg"
        />
      </div>

      <Link
        to="/play"
        className="px-8 py-3 bg-yellow-300 text-black font-bold text-lg rounded-lg shadow-lg hover:bg-yellow-400 transition duration-300"
      >
        Start Playing
      </Link>
    </div>
  );
}
