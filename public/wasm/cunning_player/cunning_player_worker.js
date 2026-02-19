// Cunning Player compute WebWorker (module worker).
// Loads the same wasm module as the main thread; `#[wasm_bindgen(start)]` detects worker scope
// and installs the worker runtime instead of starting the full app.
const __v = Date.now();
const show = (title, err) => {
  const msg = (err && (err.stack || err.message || String(err))) || "(unknown error)";
  console.error(title, err);
};
addEventListener("error", (e) => show("Worker runtime error", e?.error || e?.message));
addEventListener("unhandledrejection", (e) => show("Worker unhandled rejection", e?.reason));
const { default: init } = await import(`./cunning_player.js?v=${__v}`);
await init({ module_or_path: `./cunning_player_bg.wasm?v=${__v}` });

