// Cunning3D 特性配置 - 首页 Features 区展示（分类版）

export interface Feature {
  icon: string;
  title: string;
  description: string;
  titleZh?: string;
  descriptionZh?: string;
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
      {
        icon: 'workflow',
        title: 'Node Graph Editor',
        description: 'Visual, infinite canvas node editor with 50+ built-in node types.',
        titleZh: '节点图编辑器',
        descriptionZh: '可视化无限画布节点编辑器，内置 50+ 节点类型。',
      },
      {
        icon: 'box',
        title: 'VDB & Boolean',
        description: 'Industry-standard OpenVDB + Manifold boolean for clean mesh operations.',
        titleZh: 'VDB 与布尔',
        descriptionZh: '行业标准 OpenVDB + Manifold 布尔运算，实现干净的网格操作。',
      },
      {
        icon: 'refresh-cw',
        title: 'Non-Destructive',
        description: 'Keep source geometry intact. Modify parameters anytime without losing work.',
        titleZh: '非破坏式',
        descriptionZh: '保持源几何不变，随时调整参数而不丢失成果。',
      },
      {
        icon: 'move-3d',
        title: 'Poly Bevel & Extrude',
        description: 'Professional-grade poly modeling operators with full control.',
        titleZh: '多边形倒角/挤出',
        descriptionZh: '专业级多边形建模算子，细节可控。',
      },
    ],
  },
  {
    id: 'performance',
    icon: 'zap',
    title: 'High Performance',
    description: 'Blazing fast operations powered by Rust and GPU compute.',
    features: [
      {
        icon: 'cpu',
        title: 'Rust Core',
        description: 'Memory-safe, concurrent geometry kernel built in pure Rust.',
        titleZh: 'Rust 核心',
        descriptionZh: '纯 Rust 构建的内存安全、并发几何内核。',
      },
      {
        icon: 'monitor',
        title: 'GPU Compute',
        description: 'Heavy lifting offloaded to GPU shaders. Zero-copy architecture.',
        titleZh: 'GPU 计算',
        descriptionZh: '重计算下放 GPU Shader，零拷贝架构。',
      },
      {
        icon: 'git-branch',
        title: 'Parallel Processing',
        description: 'Rayon + DashMap for multi-threaded mesh operations.',
        titleZh: '并行处理',
        descriptionZh: 'Rayon + DashMap 实现多线程网格运算。',
      },
    ],
  },
  {
    id: 'platform',
    icon: 'globe',
    title: 'Cross-Platform',
    description: 'Run everywhere: desktop, browser, game engines.',
    features: [
      {
        icon: 'gamepad-2',
        title: 'Unity Integration',
        description: 'Native Unity Editor plugin via FFI. Real-time procedural generation in-engine.',
        titleZh: 'Unity 集成',
        descriptionZh: '通过 FFI 的原生 Unity 编辑器插件，引擎内实时程序化生成。',
      },
      {
        icon: 'laptop',
        title: 'Desktop Native',
        description: 'Windows, macOS, Linux with Vulkan/Metal/DX12 rendering.',
        titleZh: '原生桌面端',
        descriptionZh: 'Windows/macOS/Linux，Vulkan/Metal/DX12 渲染。',
      },
      {
        icon: 'globe',
        title: 'WebAssembly',
        description: 'Run in browser. iPad + touch device support via WASM.',
        titleZh: 'WebAssembly',
        descriptionZh: '浏览器运行，WASM 支持 iPad 与触控设备。',
      },
    ],
  },
  {
    id: 'extensibility',
    icon: 'plug',
    title: 'Extensibility',
    description: 'Customize and extend with scripts and plugins.',
    features: [
      {
        icon: 'scroll-text',
        title: 'Rhai Scripting',
        description: 'Create custom nodes with Rhai scripts. No recompilation needed.',
        titleZh: 'Rhai 脚本',
        descriptionZh: '用 Rhai 脚本创建自定义节点，无需重新编译。',
      },
      {
        icon: 'puzzle',
        title: 'Plugin System',
        description: 'Drop-in plugin architecture. Add new nodes by creating a file.',
        titleZh: '插件系统',
        descriptionZh: '即插即用的插件架构，通过创建文件添加新节点。',
      },
      {
        icon: 'wrench',
        title: 'Open API',
        description: 'Full geometry API exposed for custom tools and integrations.',
        titleZh: '开放 API',
        descriptionZh: '完整几何 API，便于自定义工具与集成。',
      },
    ],
  },
  {
    id: 'ai',
    icon: 'brain',
    title: 'AI-Powered',
    description: 'Built-in AI assistance. Local-first, privacy-focused, 100% free.',
    bgClass: 'bg-gradient-to-br from-violet-950 via-slate-900 to-slate-950',
    features: [
      {
        icon: 'bot',
        title: 'AI Node Copilot',
        description: 'Heuristic auto-completion for node connections. Predicts next nodes like GitHub Copilot.',
        titleZh: 'AI 节点副驾',
        descriptionZh: '节点连接启发式自动补全，像 GitHub Copilot 一样预测下一步。',
      },
      {
        icon: 'sparkles',
        title: 'AI Node Authoring',
        description: 'Dedicated local AI for writing custom nodes. Fine-tuned for Cunning3D API. 100% free, offline.',
        titleZh: 'AI 节点编写',
        descriptionZh: '专用本地 AI 编写自定义节点，针对 Cunning3D API 微调，100% 免费离线。',
      },
      {
        icon: 'message-square',
        title: 'AI Workspace',
        description: 'Chat-based graph editing. Describe what you want, AI builds the node network.',
        titleZh: 'AI 工作区',
        descriptionZh: '聊天式图编辑，描述需求，AI 生成节点网络。',
      },
      {
        icon: 'eye',
        title: 'Geometry Insight',
        description: 'AI can "see" your geometry. Inspect mesh stats and topology for context-aware suggestions.',
        titleZh: '几何洞察',
        descriptionZh: 'AI 可“看见”几何，分析网格统计与拓扑，给出上下文建议。',
      },
      {
        icon: 'sliders',
        title: 'AI Tool System',
        description: 'Extensible AI tools: create nodes, edit parameters, execute scripts via natural language.',
        titleZh: 'AI 工具系统',
        descriptionZh: '可扩展 AI 工具：自然语言创建节点、编辑参数、执行脚本。',
      },
      {
        icon: 'brain-circuit',
        title: 'Local LLM First',
        description: 'Run Qwen3 locally. No API keys, no cloud dependency. Full AI features even offline.',
        titleZh: '本地 LLM 优先',
        descriptionZh: '本地运行 Qwen3，无需 API Key、无云依赖，离线也可用完整 AI 功能。',
      },
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
