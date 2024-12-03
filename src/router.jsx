import { createBrowserRouter, redirect } from "react-router-dom";
import Home from "./pages/Home";
import MainLayout from "./pages/MainLayout";

const router = createBrowserRouter([
  {
    path: "/",
    loader: () => {
      return redirect('/home')
    }
  },
  {
    path: '/',
    element: <MainLayout/>,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
    ]
  }
])

export default router