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

function titleFromFilename(name) {
  return name.replace(/\.cda$/i, "");
}

const IMAGE_EXTENSIONS = [".webp", ".png", ".jpg", ".jpeg", ".avif", ".gif"];

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

function safeString(v) {
  return typeof v === "string" ? v.trim() : "";
}

function safeStringArray(v) {
  if (!Array.isArray(v)) return [];
  return v.map(safeString).filter(Boolean).slice(0, 12);
}

function safeBoolean(v) {
  return typeof v === "boolean" ? v : undefined;
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

async function findExampleImageFile(baseName) {
  for (const ext of IMAGE_EXTENSIONS) {
    const candidate = `${baseName}${ext}`;
    const p = path.join(examplesDir, candidate);
    if (await exists(p)) return candidate;
  }
  return null;
}

async function readExampleMetadata(baseName) {
  const p = path.join(examplesDir, `${baseName}.json`);
  // Avoid colliding with the generated index file.
  if (baseName.toLowerCase() === "index") return null;

  try {
    const txt = await fs.readFile(p, "utf8");
    const json = JSON.parse(txt) ?? {};
    return {
      title: safeString(json.title),
      author: safeString(json.author),
      authorLink: safeString(json.authorLink),
      description: safeString(json.description),
      tags: safeStringArray(json.tags),
      featured: safeBoolean(json.featured),
      image: safeString(json.image),
    };
  } catch {
    return null;
  }
}

async function main() {
  if (!(await exists(examplesDir))) {
    await fs.mkdir(examplesDir, { recursive: true });
  }

  const files = await listCdaFiles(examplesDir);
  const items = await Promise.all(
    files.map(async (file) => {
      const cdaPath = path.join(examplesDir, file);
      let bytes;
      let updatedAt;
      try {
        const stat = await fs.stat(cdaPath);
        bytes = stat.size;
        updatedAt = stat.mtime ? stat.mtime.toISOString() : undefined;
      } catch {
        // ignore
      }

      const id = idFromFilename(file);
      const baseName = titleFromFilename(file);
      const metadata = await readExampleMetadata(baseName);
      const title = metadata?.title || baseName;
      const imageFile = await findExampleImageFile(baseName);
      return {
        id,
        title,
        author: metadata?.author || "Cunning3D",
        authorLink: metadata?.authorLink || undefined,
        image: (() => {
          if (metadata?.image) {
            if (/^https?:\/\//i.test(metadata.image)) return metadata.image;
            if (metadata.image.startsWith("/")) return `${basePath}${metadata.image}`;
            return `${basePath}/examples/${metadata.image}`;
          }
          return imageFile ? `${basePath}/examples/${imageFile}` : `${basePath}/banner.png`;
        })(),
        description: metadata?.description || title,
        bytes,
        updatedAt,
        tags: metadata?.tags?.length ? metadata.tags : ["Example"],
        featured: metadata?.featured ?? false,
        // Leave filenames unencoded; URLs get encoded when passed as query params in the UI.
        cdaUrl: `${basePath}/examples/${file}`,
      };
    })
  );

  await fs.writeFile(outFile, JSON.stringify({ items }, null, 2) + "\n", "utf8");
  console.log(`[generate-examples-index] wrote ${items.length} item(s) to ${outFile}`);
}

main().catch((e) => {
  console.error("[generate-examples-index] failed:", e);
  process.exit(1);
});

