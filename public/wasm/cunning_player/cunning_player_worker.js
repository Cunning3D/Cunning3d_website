import init from "./cunning_player.js";

// The wasm module detects worker context and installs the compute message loop.
init({ module_or_path: "./cunning_player_bg.wasm" }).catch((e) => {
  console.error("cunning_player worker init failed:", e);
});

