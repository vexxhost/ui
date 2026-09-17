import { execFileSync } from "node:child_process";
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  copyFileSync,
  existsSync,
  rmSync,
} from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = process.argv[2] && path.resolve(process.argv[2]);
if (!target || target === source)
  throw Error("Usage: npm run link:consumer -- /path/to/consumer");
const run = (command, args, cwd = source) =>
  execFileSync(command, args, { cwd, encoding: "utf8" });
if (run("git", ["status", "--porcelain"]).trim())
  throw Error("Commit the UI checkout before linking a consumer.");
const revision = run("git", ["rev-parse", "HEAD"]).trim();
const packageJson = JSON.parse(
  readFileSync(path.join(source, "package.json"), "utf8"),
);
const consumerPath = existsSync(path.join(target, "services/web/package.json"))
  ? "services/web/package.json"
  : "package.json";
const manifestPath = path.join(target, consumerPath);
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
console.log(run("npm", ["run", "build"]));
const [{ filename }] = JSON.parse(
  run("npm", ["pack", "--ignore-scripts", "--json"]),
);
const artifact = `vexxhost-ui-${packageJson.version}-${revision.slice(0, 12)}.tgz`;
const vendor = path.join(path.dirname(manifestPath), "vendor");
mkdirSync(vendor, { recursive: true });
const previous = manifest.dependencies?.["@vexxhost/ui"];
copyFileSync(path.join(source, filename), path.join(vendor, artifact));
const relative = path
  .relative(path.dirname(manifestPath), path.join(vendor, artifact))
  .split(path.sep)
  .join("/");
manifest.dependencies = {
  ...manifest.dependencies,
  "@vexxhost/ui": `file:${relative}`,
};
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
const integrity =
  "sha512-" +
  createHash("sha512")
    .update(readFileSync(path.join(vendor, artifact)))
    .digest("base64");
writeFileSync(
  path.join(vendor, "ui-source.json"),
  JSON.stringify(
    {
      repository: "https://github.com/vexxhost/ui",
      commit: revision,
      version: packageJson.version,
      artifact,
      integrity,
    },
    null,
    2,
  ) + "\n",
);
if (existsSync(path.join(target, "pnpm-lock.yaml")))
  console.log(
    run(
      "corepack",
      [
        "pnpm",
        "install",
        "--lockfile-only",
        "--no-frozen-lockfile",
        "--ignore-scripts",
      ],
      target,
    ),
  );
else
  console.log(
    run(
      "npm",
      [
        "install",
        "--package-lock-only",
        "--ignore-scripts",
        "--no-audit",
        "--no-fund",
      ],
      target,
    ),
  );
// Remove only the previously referenced VEXXHOST artifact, after a successful lockfile update.
if (previous?.startsWith("file:")) {
  const old = path.resolve(path.dirname(manifestPath), previous.slice(5));
  if (
    path.dirname(old) === vendor &&
    /^vexxhost-ui-.*\.tgz$/.test(path.basename(old)) &&
    old !== path.join(vendor, artifact)
  )
    rmSync(old, { force: true });
}
console.log(
  `Linked ${manifest.name} to vexxhost/ui@${revision}. Review and commit the manifest, lockfile, and vendor files.`,
);
