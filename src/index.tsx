import "./polyfills";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { HashRouter } from "react-router";

const root: HTMLElement = document.getElementById("root") as HTMLElement;

createRoot(root).render(
  <HashRouter basename={import.meta.env.PROD ? "/ManifestEditor" : "/"}>
    <App />
  </HashRouter>
);