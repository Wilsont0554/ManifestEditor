import "./polyfills";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router";
import { VaultProvider } from "react-iiif-vault";

const root: HTMLElement = document.getElementById("root") as HTMLElement;

createRoot(root).render(
  <BrowserRouter>
    <VaultProvider>
      <App />
    </VaultProvider>
  </BrowserRouter>
);