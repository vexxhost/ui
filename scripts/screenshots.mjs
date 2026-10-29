// Captures the gallery in light and dark mode into docs/images.
import { spawn } from "node:child_process"
import { chromium } from "@playwright/test"

const server = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "preview"], { stdio: "ignore" })
try {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2 })
  for (let attempt = 0; ; attempt++) {
    try {
      await page.goto("http://127.0.0.1:4173/")
      break
    } catch (error) {
      if (attempt > 50) throw error
      await new Promise((resolve) => setTimeout(resolve, 200))
    }
  }
  for (const theme of ["light", "dark"]) {
    await page.goto(`http://127.0.0.1:4173/${theme === "dark" ? "?theme=dark" : ""}`)
    await page.screenshot({ path: `docs/images/gallery-${theme}.png`, fullPage: true })
  }
  await browser.close()
} finally {
  server.kill()
}
