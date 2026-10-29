import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

for (const theme of ["light", "dark"] as const) {
  test(`the gallery has no WCAG A/AA violations in ${theme} mode`, async ({ page }) => {
    await page.goto(theme === "dark" ? "/?theme=dark" : "/")
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22a", "wcag22aa"])
      .analyze()
    expect(results.violations).toEqual([])
  })
}

test("a loading button is busy, disabled, focusable and swaps its icon for a spinner", async ({ page }) => {
  await page.goto("/")
  const button = page.getByTestId("save-demo")
  await button.focus()
  await button.click()

  await expect(button).toHaveAttribute("aria-busy", "true")
  await expect(button).toHaveAttribute("aria-disabled", "true")
  await expect(button).toBeFocused()
  await expect(button.locator('[data-slot="spinner"]')).toBeVisible()
  await expect(button.locator("svg").nth(1)).toBeHidden()

  await expect(button).not.toHaveAttribute("aria-busy", "true", { timeout: 5000 })
  await expect(button.locator('[data-slot="spinner"]')).toHaveCount(0)
  await expect(button.locator("svg")).toBeVisible()
})

test("buttons default to type=button so they never submit a form by accident", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("button", { name: "Create instance" })).toHaveAttribute("type", "button")
})

test("the danger tone colours text with the danger token", async ({ page }) => {
  await page.goto("/")
  const color = await page
    .getByRole("button", { name: "Delete volume" })
    .evaluate((element) => getComputedStyle(element).color)
  const danger = await page.evaluate(() => {
    const probe = document.createElement("span")
    probe.style.color = "var(--status-danger)"
    document.body.append(probe)
    const value = getComputedStyle(probe).color
    probe.remove()
    return value
  })
  expect(color).toBe(danger)
})

test("the copy button writes to the clipboard and confirms", async ({ page }) => {
  await page.goto("/")
  const button = page.getByTestId("copy-icon")
  await button.click()
  await expect(button).toHaveAttribute("title", "Copied")
  await expect(button).toHaveAttribute("data-copied", "")
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "8f2c1a90-4d1e-4b6f-9d1c-2a6e0b7d5c31"
  )
  await expect(button).toHaveAccessibleName("Copy ID")
})
