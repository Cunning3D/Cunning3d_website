import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, "..");
const srcDir = path.resolve(
  repoRoot,
  "..",
  "Cunning3D_1.0",
  "crates",
  "cunning_player",
  "web_output"
);
const dstDir = path.resolve(repoRoot, "public", "wasm", "cunning_player");

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!(await exists(srcDir))) {
    const wasmPath = path.join(dstDir, "cunning_player_bg.wasm");
    if (await exists(wasmPath)) {
      console.log(
        `[sync-wasm-player] source not found, using existing public assets: ${wasmPath}`
      );
      process.exit(0);
    }

    console.warn(`[sync-wasm-player] source not found: ${srcDir}`);
    console.warn(
      `[sync-wasm-player] build WASM first: Cunning3D_1.0/crates/cunning_player/scripts/build_wasm.ps1`
    );
    process.exit(0);
  }

  await fs.mkdir(dstDir, { recursive: true });
  const entries = await fs.readdir(srcDir, { withFileTypes: true });

  let copied = 0;
  for (const e of entries) {
    if (!e.isFile()) continue;
    const from = path.join(srcDir, e.name);
    const to = path.join(dstDir, e.name);
    await fs.copyFile(from, to);
    copied++;
  }

  if (copied === 0) {
    console.warn(`[sync-wasm-player] no files copied from ${srcDir}`);
    process.exit(0);
  }

  // Sanity check: wasm-bindgen output should include the bg wasm.
  const wasmPath = path.join(dstDir, "cunning_player_bg.wasm");
  if (!(await exists(wasmPath))) {
    console.warn(
      `[sync-wasm-player] warning: missing ${wasmPath} (did wasm-bindgen run?)`
    );
  }

  console.log(`[sync-wasm-player] copied ${copied} file(s) to ${dstDir}`);
}

main().catch((e) => {
  console.error("[sync-wasm-player] failed:", e);
  process.exit(1);
});

