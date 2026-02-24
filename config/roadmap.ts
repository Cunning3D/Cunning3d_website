// Cunning3D 路线图配置

export interface RoadmapItem {
  title: string;
  description: string;
  titleZh?: string;
  descriptionZh?: string;
  status: 'done' | 'in-progress' | 'planned' | 'future';
  version?: string;
  date?: string;
}

export interface RoadmapPhase {
  id: string;
  title: string;
  titleZh?: string;
  icon: string;
  timeframe: string;
  timeframeZh?: string;
  items: RoadmapItem[];
}

export const roadmapPhases: RoadmapPhase[] = [
  {
    id: 'foundation',
    title: 'Foundation',
    titleZh: '基础',
    icon: 'construction',
    timeframe: 'Q4 2025 - Q1 2026',
    timeframeZh: '2025 Q4 - 2026 Q1',
    items: [
      {
        title: 'Core Node Graph Engine',
        description: 'Infinite canvas with pan/zoom, 50+ built-in nodes',
        titleZh: '核心节点图引擎',
        descriptionZh: '支持平移/缩放的无限画布，内置 50+ 节点',
        status: 'done',
      },
      {
        title: 'Rust Geometry Kernel',
        description: 'High-performance mesh operations with Rayon parallelism',
        titleZh: 'Rust 几何内核',
        descriptionZh: 'Rayon 并行加速的高性能网格运算',
        status: 'done',
      },
      {
        title: 'Bevy Renderer Integration',
        description: 'Real-time viewport with GPU-accelerated rendering',
        titleZh: 'Bevy 渲染器集成',
        descriptionZh: 'GPU 加速的实时视口渲染',
        status: 'done',
      },
      {
        title: 'Rhai Scripting Engine',
        description: 'Custom node authoring without recompilation',
        titleZh: 'Rhai 脚本引擎',
        descriptionZh: '无需重新编译即可编写自定义节点',
        status: 'done',
      },
      {
        title: 'VDB Volume Support',
        description: 'OpenVDB integration for volumetric operations',
        titleZh: 'VDB 体积支持',
        descriptionZh: '集成 OpenVDB，实现体积运算',
        status: 'done',
      },
      {
        title: 'Boolean Operations',
        description: 'Manifold-powered clean boolean mesh operations',
        titleZh: '布尔运算',
        descriptionZh: '基于 Manifold 的干净网格布尔运算',
        status: 'done',
      },
    ],
  },
  {
    id: 'integration',
    title: 'Engine Integration',
    titleZh: '引擎集成',
    icon: 'gamepad',
    timeframe: 'Q1 - Q2 2026',
    timeframeZh: '2026 Q1 - Q2',
    items: [
      {
        title: 'Unity FFI Plugin',
        description: 'Native Unity Editor integration via C FFI',
        titleZh: 'Unity FFI 插件',
        descriptionZh: '通过 C FFI 进行 Unity 编辑器原生集成',
        status: 'in-progress',
      },
      {
        title: 'PolyBevel Node',
        description: 'Professional-grade edge beveling with custom profiles',
        titleZh: 'PolyBevel 节点',
        descriptionZh: '专业级边倒角，支持自定义剖面',
        status: 'in-progress',
      },
      {
        title: 'PolyExtrude Node',
        description: 'Advanced polygon extrusion with inset/offset',
        titleZh: 'PolyExtrude 节点',
        descriptionZh: '高级多边形挤出（内插/偏移）',
        status: 'done',
      },
      {
        title: 'WebAssembly Build',
        description: 'Browser and iPad support via WASM',
        titleZh: 'WebAssembly 构建',
        descriptionZh: '通过 WASM 支持浏览器与 iPad',
        status: 'done',
      },
      {
        title: 'Unreal Plugin',
        description: 'Unreal Engine 5 integration',
        titleZh: 'Unreal 插件',
        descriptionZh: 'Unreal Engine 5 集成',
        status: 'planned',
      },
      {
        title: 'Blender Add-on',
        description: 'Blender integration for asset pipeline',
        titleZh: 'Blender 插件',
        descriptionZh: 'Blender 资产管线集成',
        status: 'planned',
      },
    ],
  },
  {
    id: 'ai',
    title: 'AI Features',
    titleZh: 'AI 功能',
    icon: 'brain',
    timeframe: 'Q2 - Q3 2026',
    timeframeZh: '2026 Q2 - Q3',
    items: [
      {
        title: 'AI Workspace',
        description: 'Chat-based graph editing with tool calling',
        titleZh: 'AI 工作区',
        descriptionZh: '支持工具调用的聊天式图编辑',
        status: 'done',
      },
      {
        title: 'Local LLM Integration',
        description: 'Qwen3 local inference, no API keys needed',
        titleZh: '本地 LLM 集成',
        descriptionZh: 'Qwen3 本地推理，无需 API Key',
        status: 'done',
      },
      {
        title: 'AI Node Copilot',
        description: 'Heuristic auto-completion for node connections',
        titleZh: 'AI 节点副驾',
        descriptionZh: '节点连接启发式自动补全',
        status: 'in-progress',
      },
      {
        title: 'AI Node Authoring',
        description: 'Dedicated AI for writing custom Rhai nodes',
        titleZh: 'AI 节点编写',
        descriptionZh: '专用 AI 编写自定义 Rhai 节点',
        status: 'planned',
      },
      {
        title: 'Geometry-Aware AI',
        description: 'AI can inspect mesh stats for context-aware suggestions',
        titleZh: '几何感知 AI',
        descriptionZh: 'AI 可分析网格统计数据，给出上下文建议',
        status: 'done',
      },
      {
        title: 'Voice Control',
        description: 'Natural language voice commands for hands-free modeling',
        titleZh: '语音控制',
        descriptionZh: '自然语言语音指令，解放双手建模',
        status: 'future',
      },
    ],
  },
  {
    id: 'advanced',
    title: 'Advanced Modeling',
    titleZh: '高级建模',
    icon: 'hexagon',
    timeframe: 'Q3 - Q4 2026',
    timeframeZh: '2026 Q3 - Q4',
    items: [
      {
        title: 'VDB Sculpting',
        description: 'Real-time volumetric sculpting with brush tools',
        titleZh: 'VDB 雕刻',
        descriptionZh: '基于笔刷的实时体积雕刻',
        status: 'planned',
      },
      {
        title: 'Curve Modeling',
        description: 'NURBS and Bezier curve-based geometry',
        titleZh: '曲线建模',
        descriptionZh: '基于 NURBS 与 Bézier 的曲线几何',
        status: 'in-progress',
      },
      {
        title: 'UV Auto-Unwrap',
        description: 'Automatic UV unwrapping with island packing',
        titleZh: 'UV 自动展开',
        descriptionZh: '自动 UV 展开与岛屿打包',
        status: 'planned',
      },
      {
        title: 'LOD Generation',
        description: 'Automatic level-of-detail mesh generation',
        titleZh: 'LOD 生成',
        descriptionZh: '自动生成多级细节（LOD）网格',
        status: 'planned',
      },
      {
        title: 'Procedural Texturing',
        description: 'Node-based texture generation',
        titleZh: '程序化贴图',
        descriptionZh: '基于节点的纹理生成',
        status: 'future',
      },
      {
        title: 'Physics Simulation',
        description: 'Soft body and cloth simulation nodes',
        titleZh: '物理模拟',
        descriptionZh: '软体与布料模拟节点',
        status: 'future',
      },
    ],
  },
  {
    id: 'ecosystem',
    title: 'Ecosystem',
    titleZh: '生态',
    icon: 'globe',
    timeframe: '2027+',
    timeframeZh: '2027+',
    items: [
      {
        title: 'Node Marketplace',
        description: 'Share and download community-created nodes',
        titleZh: '节点市场',
        descriptionZh: '分享与下载社区节点',
        status: 'future',
      },
      {
        title: 'Cloud Compute',
        description: 'Offload heavy operations to cloud workers',
        titleZh: '云端计算',
        descriptionZh: '将重计算下发到云端 worker',
        status: 'future',
      },
      {
        title: 'Collaboration',
        description: 'Real-time multi-user editing',
        titleZh: '协作',
        descriptionZh: '实时多人协作编辑',
        status: 'future',
      },
      {
        title: 'Mobile App',
        description: 'Native iOS/Android viewer and light editing',
        titleZh: '移动端应用',
        descriptionZh: '原生 iOS/Android 查看与轻量编辑',
        status: 'future',
      },
    ],
  },
];

export const statusColors: Record<RoadmapItem['status'], { bg: string; text: string; label: string }> = {
  'done': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Done' },
  'in-progress': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', label: 'In Progress' },
  'planned': { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', label: 'Planned' },
  'future': { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-500 dark:text-slate-400', label: 'Future' },
};
