import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContexts";

export default function Navbar() {
  const { currentTheme, setTheme, theme } = useTheme();

  return (
    <nav className={`${theme[currentTheme].navbar} p-5 shadow-lg w-full`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Logo" className="w-16 h-auto" />
          <span className="font-nougat text-white text-4xl font-extrabold tracking-tight hover:text-yellow-300 transition-all duration-300">
            Tac<span className="text-green-300">Ticular</span>
          </span>
        </div>

        <div className="flex items-center space-x-8">
          <Link
            to="/home"
            className={`text-lg font-semibold ${theme[currentTheme].text} hover:text-yellow-300 transition duration-300 transform hover:scale-105 hover:underline`}
          >
            Home
          </Link>
          <Link
            to="/play"
            className={`text-lg font-semibold ${theme[currentTheme].text} hover:text-yellow-300 transition duration-300 transform hover:scale-105 hover:underline`}
          >
            Play
          </Link>

          <div
            onClick={() =>
              setTheme(currentTheme === "light" ? "dark" : "light")
            }
            className={`relative w-16 h-8 rounded-full cursor-pointer flex items-center transition-all duration-300 ease-in-out ${
              currentTheme === "light" ? "bg-gray-300" : "bg-gray-700"
            }`}
          >
            <div
              className={`absolute w-7 h-7 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                currentTheme === "light" ? "translate-x-1" : "translate-x-9"
              }`}
            ></div>
          </div>
        </div>
      </div>
    </nav>
  );
}
