import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "./context/Context.jsx";
import { ThemeContext } from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <ThemeContext>
        <AuthContext>
          <App />
        </AuthContext>
      </ThemeContext>
    </StrictMode>
  </BrowserRouter>,
);
