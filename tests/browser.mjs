import { chromium } from "playwright";
import assert from "node:assert/strict";
import { createServer } from "vite";
const server = await createServer({
  root: new URL("..", import.meta.url).pathname,
  server: { host: "127.0.0.1", port: 5174, strictPort: true },
});
await server.listen();
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
try {
  await page.goto("http://127.0.0.1:5174/tests/");
  const primary = page.getByRole("button", { name: "Primary", exact: true });
  await primary.click();
  await page.getByText("clicked", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Focus primary" }).click();
  assert.equal(
    await primary.evaluate((e) => e === document.activeElement),
    true,
  );
  await primary.press("Space");
  await page.getByText("clicked", { exact: true }).waitFor();
  assert.equal(
    await page
      .getByRole("button", { name: "Disabled", exact: true })
      .isDisabled(),
    true,
  );
  await page.getByRole("button", { name: "Save", exact: true }).click();
  assert.equal(await page.getByTestId("save").isDisabled(), true);
  await page.getByRole("button", { name: "Approve" }).click();
  await page.getByText("approve", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Retry", exact: true }).click();
  await page.getByText("retry", { exact: true }).waitFor();
  await page.getByRole("button", { name: "No submit" }).click();
  await page.getByText("no-submit", { exact: true }).waitFor();
  const link = page.getByRole("link", { name: "Destination" });
  assert.equal(await link.locator("button,a").count(), 0);
  assert.equal(await link.getAttribute("data-router-link"), "true");
  assert.equal(await page.getByRole("button", { name: "Add item" }).count(), 1);
  await link.click();
  await page.getByText("link-click", { exact: true }).waitFor();
  assert(page.url().endsWith("#destination"));
  await page.getByRole("button", { name: "Slotted" }).click();
  await page.getByText("slotted", { exact: true }).waitFor();
  assert.equal(
    await page
      .getByRole("button", { name: "Slotted" })
      .getAttribute("data-probe"),
    "slot",
  );
  const light = await primary.evaluate((e) => ({
    brand: getComputedStyle(e).getPropertyValue("--color-kumo-brand").trim(),
    height: e.getBoundingClientRect().height,
    bg: getComputedStyle(e).backgroundColor,
  }));
  assert.equal(light.brand, "#6d28d9");
  assert.equal(light.height, 36);
  assert.notEqual(light.bg, "rgba(0, 0, 0, 0)");
  await page.evaluate(() => document.documentElement.classList.add("dark"));
  assert.equal(
    await primary.evaluate((e) =>
      getComputedStyle(e).getPropertyValue("--color-kumo-brand").trim(),
    ),
    "#7c3aed",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: passthrough identity, refs, mouse/keyboard, loading/disabled, form submitters, default type, router links/events, icon accessibility, and compiled purple light/dark styles.",
  );
} finally {
  await browser.close();
  await server.close();
}
