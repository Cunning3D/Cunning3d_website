// Cunning3D 特性配置 - 首页 Features 区展示（分类版）

export interface Feature {
  icon: string;
  title: string;
  description: string;
  link?: string;
}

export interface FeatureCategory {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: Feature[];
  bgClass?: string; // 可选的背景样式
}

// 所有功能分类
export const featureCategories: FeatureCategory[] = [
  {
    id: 'modeling',
    icon: 'hexagon',
    title: 'Procedural Modeling',
    description: 'Non-destructive, node-based geometry creation for infinite creative possibilities.',
    features: [
      { icon: 'workflow', title: 'Node Graph Editor', description: 'Visual, infinite canvas node editor with 50+ built-in node types.' },
      { icon: 'box', title: 'VDB & Boolean', description: 'Industry-standard OpenVDB + Manifold boolean for clean mesh operations.' },
      { icon: 'refresh-cw', title: 'Non-Destructive', description: 'Keep source geometry intact. Modify parameters anytime without losing work.' },
      { icon: 'move-3d', title: 'Poly Bevel & Extrude', description: 'Professional-grade poly modeling operators with full control.' },
    ],
  },
  {
    id: 'performance',
    icon: 'zap',
    title: 'High Performance',
    description: 'Blazing fast operations powered by Rust and GPU compute.',
    features: [
      { icon: 'cpu', title: 'Rust Core', description: 'Memory-safe, concurrent geometry kernel built in pure Rust.' },
      { icon: 'monitor', title: 'GPU Compute', description: 'Heavy lifting offloaded to GPU shaders. Zero-copy architecture.' },
      { icon: 'git-branch', title: 'Parallel Processing', description: 'Rayon + DashMap for multi-threaded mesh operations.' },
    ],
  },
  {
    id: 'platform',
    icon: 'globe',
    title: 'Cross-Platform',
    description: 'Run everywhere: desktop, browser, game engines.',
    features: [
      { icon: 'gamepad-2', title: 'Unity Integration', description: 'Native Unity Editor plugin via FFI. Real-time procedural generation in-engine.' },
      { icon: 'laptop', title: 'Desktop Native', description: 'Windows, macOS, Linux with Vulkan/Metal/DX12 rendering.' },
      { icon: 'globe', title: 'WebAssembly', description: 'Run in browser. iPad + touch device support via WASM.' },
    ],
  },
  {
    id: 'extensibility',
    icon: 'plug',
    title: 'Extensibility',
    description: 'Customize and extend with scripts and plugins.',
    features: [
      { icon: 'scroll-text', title: 'Rhai Scripting', description: 'Create custom nodes with Rhai scripts. No recompilation needed.' },
      { icon: 'puzzle', title: 'Plugin System', description: 'Drop-in plugin architecture. Add new nodes by creating a file.' },
      { icon: 'wrench', title: 'Open API', description: 'Full geometry API exposed for custom tools and integrations.' },
    ],
  },
  {
    id: 'ai',
    icon: 'brain',
    title: 'AI-Powered',
    description: 'Built-in AI assistance. Local-first, privacy-focused, 100% free.',
    bgClass: 'bg-gradient-to-br from-violet-950 via-slate-900 to-slate-950',
    features: [
      { icon: 'bot', title: 'AI Node Copilot', description: 'Heuristic auto-completion for node connections. Predicts next nodes like GitHub Copilot.' },
      { icon: 'sparkles', title: 'AI Node Authoring', description: 'Dedicated local AI for writing custom nodes. Fine-tuned for Cunning3D API. 100% free, offline.' },
      { icon: 'message-square', title: 'AI Workspace', description: 'Chat-based graph editing. Describe what you want, AI builds the node network.' },
      { icon: 'eye', title: 'Geometry Insight', description: 'AI can "see" your geometry. Inspect mesh stats and topology for context-aware suggestions.' },
      { icon: 'sliders', title: 'AI Tool System', description: 'Extensible AI tools: create nodes, edit parameters, execute scripts via natural language.' },
      { icon: 'brain-circuit', title: 'Local LLM First', description: 'Run Qwen3 locally. No API keys, no cloud dependency. Full AI features even offline.' },
    ],
  },
];

// 兼容旧代码：导出扁平化的 features 和 aiFeatures
export const features = featureCategories
  .filter(c => c.id !== 'ai')
  .flatMap(c => c.features);

export const aiFeatures = featureCategories
  .find(c => c.id === 'ai')?.features || [];

// 未来计划的功能
export const upcomingFeatures: Feature[] = [
  { icon: 'paintbrush', title: 'VDB Sculpting', description: 'Volumetric sculpting with real-time feedback.' },
  { icon: 'pen-tool', title: 'Pen & Touch', description: 'Full iPad and Pen Tablet support with pressure sensitivity.' },
  { icon: 'refresh-cw', title: 'Live Sync', description: 'Real-time sync with Unity, Blender, and other DCCs.' },
];
