import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  root: resolve(__dirname, "src"),
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    host: String(process.env["WEB_HOST"]),
    port: Number(process.env["WEB_PORT"]),
  },
  define: {
    "import.meta.env.SERVER_URL": JSON.stringify(process.env["SERVER_URL"]),
    "import.meta.env.SERVER_HOST": JSON.stringify(process.env["SERVER_HOST"]),
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
} satisfies UserConfig;
