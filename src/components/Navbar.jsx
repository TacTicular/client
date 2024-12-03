import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 p-5 shadow-lg w-full">
      <div className="flex items-center justify-between max-w-7xl mx-auto">

        <div className="flex items-center space-x-3">
          <span className="font-nougat text-white text-4xl font-extrabold tracking-tight hover:text-yellow-300 transition-all duration-300">
            Tac<span className="text-green-300">Ticular</span>
          </span>
        </div>

        <div className="space-x-8 flex items-center text-white">
          <Link
            to="/home"
            className="text-lg font-semibold hover:text-yellow-300 transition duration-300 transform hover:scale-105 hover:underline"
          >
            Home
          </Link>
          <Link
            to="/play"
            className="text-lg font-semibold hover:text-yellow-300 transition duration-300 transform hover:scale-105 hover:underline"
          >
            Play
          </Link>
        </div>
      </div>
    </nav>
  );
}
