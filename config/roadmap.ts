// Cunning3D 路线图配置

export interface RoadmapItem {
  title: string;
  description: string;
  status: 'done' | 'in-progress' | 'planned' | 'future';
  version?: string;
  date?: string;
}

export interface RoadmapPhase {
  id: string;
  title: string;
  icon: string;
  timeframe: string;
  items: RoadmapItem[];
}

export const roadmapPhases: RoadmapPhase[] = [
  {
    id: 'foundation',
    title: 'Foundation',
    icon: 'construction',
    timeframe: 'Q4 2025 - Q1 2026',
    items: [
      { title: 'Core Node Graph Engine', description: 'Infinite canvas with pan/zoom, 50+ built-in nodes', status: 'done' },
      { title: 'Rust Geometry Kernel', description: 'High-performance mesh operations with Rayon parallelism', status: 'done' },
      { title: 'Bevy Renderer Integration', description: 'Real-time viewport with GPU-accelerated rendering', status: 'done' },
      { title: 'Rhai Scripting Engine', description: 'Custom node authoring without recompilation', status: 'done' },
      { title: 'VDB Volume Support', description: 'OpenVDB integration for volumetric operations', status: 'done' },
      { title: 'Boolean Operations', description: 'Manifold-powered clean boolean mesh operations', status: 'done' },
    ],
  },
  {
    id: 'integration',
    title: 'Engine Integration',
    icon: 'gamepad',
    timeframe: 'Q1 - Q2 2026',
    items: [
      { title: 'Unity FFI Plugin', description: 'Native Unity Editor integration via C FFI', status: 'in-progress' },
      { title: 'PolyBevel Node', description: 'Professional-grade edge beveling with custom profiles', status: 'in-progress' },
      { title: 'PolyExtrude Node', description: 'Advanced polygon extrusion with inset/offset', status: 'done' },
      { title: 'WebAssembly Build', description: 'Browser and iPad support via WASM', status: 'done' },
      { title: 'Unreal Plugin', description: 'Unreal Engine 5 integration', status: 'planned' },
      { title: 'Blender Add-on', description: 'Blender integration for asset pipeline', status: 'planned' },
    ],
  },
  {
    id: 'ai',
    title: 'AI Features',
    icon: 'brain',
    timeframe: 'Q2 - Q3 2026',
    items: [
      { title: 'AI Workspace', description: 'Chat-based graph editing with tool calling', status: 'done' },
      { title: 'Local LLM Integration', description: 'Qwen3 local inference, no API keys needed', status: 'done' },
      { title: 'AI Node Copilot', description: 'Heuristic auto-completion for node connections', status: 'in-progress' },
      { title: 'AI Node Authoring', description: 'Dedicated AI for writing custom Rhai nodes', status: 'planned' },
      { title: 'Geometry-Aware AI', description: 'AI can inspect mesh stats for context-aware suggestions', status: 'done' },
      { title: 'Voice Control', description: 'Natural language voice commands for hands-free modeling', status: 'future' },
    ],
  },
  {
    id: 'advanced',
    title: 'Advanced Modeling',
    icon: 'hexagon',
    timeframe: 'Q3 - Q4 2026',
    items: [
      { title: 'VDB Sculpting', description: 'Real-time volumetric sculpting with brush tools', status: 'planned' },
      { title: 'Curve Modeling', description: 'NURBS and Bezier curve-based geometry', status: 'in-progress' },
      { title: 'UV Auto-Unwrap', description: 'Automatic UV unwrapping with island packing', status: 'planned' },
      { title: 'LOD Generation', description: 'Automatic level-of-detail mesh generation', status: 'planned' },
      { title: 'Procedural Texturing', description: 'Node-based texture generation', status: 'future' },
      { title: 'Physics Simulation', description: 'Soft body and cloth simulation nodes', status: 'future' },
    ],
  },
  {
    id: 'ecosystem',
    title: 'Ecosystem',
    icon: 'globe',
    timeframe: '2027+',
    items: [
      { title: 'Node Marketplace', description: 'Share and download community-created nodes', status: 'future' },
      { title: 'Cloud Compute', description: 'Offload heavy operations to cloud workers', status: 'future' },
      { title: 'Collaboration', description: 'Real-time multi-user editing', status: 'future' },
      { title: 'Mobile App', description: 'Native iOS/Android viewer and light editing', status: 'future' },
    ],
  },
];

export const statusColors: Record<RoadmapItem['status'], { bg: string; text: string; label: string }> = {
  'done': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Done' },
  'in-progress': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', label: 'In Progress' },
  'planned': { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', label: 'Planned' },
  'future': { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-500 dark:text-slate-400', label: 'Future' },
};
