import { createBrowserRouter, redirect } from "react-router-dom";
import Home from "./pages/Home";
import MainLayout from "./pages/MainLayout";
import Play from "./pages/Play";
import LoginPage from "./pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    loader: () => {
      return redirect("/home");
    },
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/play",
        element: <Play />,
        loader: () => {
          if (!localStorage.getItem("username")) {
            return redirect("/login");
          }
        },
      },
      {
        path: "/login",
        element: <LoginPage />,
        loader: () => {
          if (localStorage.getItem("username")) {
            return redirect("/play");
          }
        },
      },
    ],
  },
]);

export default router;
