import "./polyfills";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { HashRouter } from "react-router";
import { ManifestObjProvider } from "./context/manifest";

const root: HTMLElement = document.getElementById("root") as HTMLElement;

createRoot(root).render(
  <HashRouter>
      <ManifestObjProvider>
        <App />
      </ManifestObjProvider>
  </HashRouter>
);