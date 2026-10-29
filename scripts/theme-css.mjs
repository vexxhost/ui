// Renders the registry's `theme` item as CSS for the preview gallery, so the
// gallery always shows exactly what `shadcn add vexxhost/ui/theme` installs.
import { readFile, writeFile } from "node:fs/promises"

const registry = JSON.parse(await readFile(new URL("../registry.json", import.meta.url), "utf8"))
const theme = registry.items.find((item) => item.name === "theme")

const block = (selector, vars) =>
  `${selector} {\n${Object.entries(vars).map(([k, v]) => `  --${k}: ${v};`).join("\n")}\n}\n`

const rules = (node, indent = "") =>
  Object.entries(node)
    .map(([key, value]) => {
      if (key.startsWith("@apply")) return `${indent}${key};`
      if (typeof value === "string") return `${indent}${key}: ${value};`
      return `${indent}${key} {\n${rules(value, indent + "  ")}\n${indent}}`
    })
    .join("\n")

const css = [
  "/* Generated from registry.json by scripts/theme-css.mjs. Do not edit. */",
  block("@theme inline", theme.cssVars.theme),
  block(":root", theme.cssVars.light),
  block(".dark", theme.cssVars.dark),
  rules(theme.css),
  "",
].join("\n")

await writeFile(new URL("../preview/theme.generated.css", import.meta.url), css)
