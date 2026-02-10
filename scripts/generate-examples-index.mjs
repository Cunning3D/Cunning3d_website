import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, "..");
const examplesDir = path.resolve(repoRoot, "public", "examples");
const outFile = path.join(examplesDir, "index.json");

function normalizeBasePath(p) {
  const s = String(p || "").trim();
  if (!s) return "";
  const withLeadingSlash = s.startsWith("/") ? s : `/${s}`;
  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash.slice(0, -1)
    : withLeadingSlash;
}

const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

function idFromFilename(name) {
  return name.replace(/\.cda$/i, "").replace(/[^a-zA-Z0-9_-]+/g, "-");
}

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function listCdaFiles(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (!e.isFile()) continue;
    if (!e.name.toLowerCase().endsWith(".cda")) continue;
    out.push(e.name);
  }
  out.sort((a, b) => a.localeCompare(b));
  return out;
}

async function main() {
  if (!(await exists(examplesDir))) {
    await fs.mkdir(examplesDir, { recursive: true });
  }

  const files = await listCdaFiles(examplesDir);
  const items = files.map((file) => {
    const id = idFromFilename(file);
    return {
      id,
      title: id,
      author: "Cunning3D",
      image: `${basePath}/banner.png`,
      description: file,
      tags: ["Example"],
      featured: false,
      cdaUrl: `${basePath}/examples/${encodeURIComponent(file)}`,
    };
  });

  await fs.writeFile(outFile, JSON.stringify({ items }, null, 2) + "\n", "utf8");
  console.log(`[generate-examples-index] wrote ${items.length} item(s) to ${outFile}`);
}

main().catch((e) => {
  console.error("[generate-examples-index] failed:", e);
  process.exit(1);
});

