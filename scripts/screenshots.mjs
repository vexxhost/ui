import { createServer } from "vite";
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siblings = path.dirname(root);
const all = process.argv.includes("--all-apps");
const styles = {
  website: "styles/globals.css",
  eventhub: "src/app/globals.css",
  onboarding: "app/globals.css",
  atlas: "services/web/src/app/tailwind.css",
};
if (all)
  for (const [app, css] of Object.entries(styles)) {
    execFileSync(
      process.execPath,
      [
        path.join(root, "node_modules/@tailwindcss/cli/dist/index.mjs"),
        "-i",
        path.join(siblings, app, css),
        "-o",
        path.join(root, "previews/generated", `${app}.css`),
        "--minify",
      ],
      { cwd: path.join(siblings, app), stdio: "inherit" },
    );
  }
const server = await createServer({
  root,
  server: { host: "127.0.0.1", port: 5175, strictPort: true },
});
await server.listen();
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox"],
});
try {
  for (const app of all ? ["ui", ...Object.keys(styles)] : ["ui"]) {
    const dest = path.join(
      app === "ui" ? root : path.join(siblings, app),
      "docs/images/shared-buttons",
    );
    await mkdir(dest, { recursive: true });
    for (const [name, theme, width] of [
      ["light", "light", 1280],
      ["dark", "dark", 1280],
      ["mobile", "light", 390],
    ]) {
      const page = await browser.newPage({
        viewport: { width, height: 900 },
        deviceScaleFactor: 1,
      });
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(
        `http://127.0.0.1:5175/previews/?app=${app}&theme=${theme}`,
        { waitUntil: "networkidle" },
      );
      await page
        .getByRole("heading", { name: "Buttons, brought together." })
        .waitFor();
      await page.evaluate(() => document.fonts.ready);
      const metrics = await page.evaluate(() => ({
        width: document.documentElement.scrollWidth,
        viewport: innerWidth,
        buttons: [...document.querySelectorAll("button")].map((e) => ({
          text: e.textContent.trim(),
          height: e.getBoundingClientRect().height,
        })),
      }));
      if (
        errors.length ||
        metrics.width > width ||
        metrics.buttons.some((b) => b.height < 20)
      )
        throw Error(JSON.stringify({ app, name, errors, metrics }));
      await page.screenshot({
        path: path.join(dest, `${name}.png`),
        fullPage: true,
        animations: "disabled",
      });
      console.log(
        `${app}/${name}: ${metrics.buttons.length} rendered controls; no page errors or horizontal overflow`,
      );
      await page.close();
    }
  }
} finally {
  await browser.close();
  await server.close();
}
