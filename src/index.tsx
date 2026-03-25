import "./polyfills";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router";
import { ManifestObjProvider } from "./context/manifest";

const root: HTMLElement = document.getElementById("root") as HTMLElement;

createRoot(root).render(
  <BrowserRouter>
      <ManifestObjProvider>
        <App />
      </ManifestObjProvider>
  </BrowserRouter>
);