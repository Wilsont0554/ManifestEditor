import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Some dependencies expect a Node-style global object in the browser.
    global: "globalThis",
  },
});
