// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import "./index.css";
import router from "./router.jsx";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContexts.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  // <App />
  <ThemeProvider>
    <RouterProvider router={router} />
  </ThemeProvider>
  // </StrictMode>
);
