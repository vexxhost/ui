import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests",
  forbidOnly: Boolean(process.env.CI),
  reporter: process.env.CI ? "line" : "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    permissions: ["clipboard-read", "clipboard-write"],
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm exec vite preview",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
  },
})
