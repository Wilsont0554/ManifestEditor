import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
 
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // By default, Vite doesn't include shims for NodeJS
    "global.setImmediate": "((fn, ...args) => setTimeout(fn, 0, ...args))",
  },
});