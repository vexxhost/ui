import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  root: "preview",
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: /^@\/components\/ui\/(.*)$/, replacement: fromRoot("./registry/ui/$1") },
      { find: /^@\/lib\/(.*)$/, replacement: fromRoot("./registry/lib/$1") },
    ],
  },
  build: { outDir: "../dist", emptyOutDir: true },
  preview: { host: "127.0.0.1", port: 4173, strictPort: true },
})
