import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <h1 className="text-4xl text-red-600">Hello</h1>
    <App />
  </StrictMode>,
);
