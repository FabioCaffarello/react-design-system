import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./App.tsx";
import { Info } from "@ui";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Info variant={"error"}> This is an error message</Info>
    <Info variant={"warning"}> This is a warning message</Info>
    <Info variant={"info"}> This is an info message</Info>
    <Info> This is a default info component</Info>
    <App />
  </StrictMode>,
);
