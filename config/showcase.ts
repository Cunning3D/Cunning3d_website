// Showcase 案例画廊配置

export interface ShowcaseItem {
  id: string;
  title: string;
  author: string;
  authorLink?: string;
  image: string; // 图片路径或 URL
  description: string;
  tags: string[];
  featured?: boolean;
}
//,,,
// 真实风格的 Mock 数据
export const showcaseItems: ShowcaseItem[] = [
  {
    id: 'procedural-city',
    title: 'Cyberpunk City Generator',
    author: 'Alex Chen',
    authorLink: 'https://artstation.com/alexchen',
    // 赛博朋克城市图
    image: 'https://images.unsplash.com/photo-1605218427306-635ba2496ed9?q=80&w=800&auto=format&fit=crop',
    description: 'A complete procedural city generation system with roads, neon signs, and skyscrapers. All created with node graphs.',
    tags: ['Architecture', 'Procedural', 'Featured', 'Sci-Fi'],
    featured: true,
  },
  {
    id: 'organic-rocks',
    title: 'Volcanic Rock Formation',
    author: 'Maya Studio',
    authorLink: 'https://example.com',
    // 岩石纹理图
    image: 'https://images.unsplash.com/photo-1518182170546-0766ce6fec56?q=80&w=800&auto=format&fit=crop',
    description: 'Natural-looking volcanic rock formations using VDB sculpting and noise-based displacement for realistic weathering.',
    tags: ['Environment', 'VDB', 'Nature'],
    featured: true,
  },
  {
    id: 'scifi-panels',
    title: 'Sci-Fi Modular Corridors',
    author: 'NeonCraft',
    // 科幻走廊图
    image: 'https://images.unsplash.com/photo-1592669435868-ba22fb74db62?q=80&w=800&auto=format&fit=crop',
    description: 'Modular sci-fi wall panels and corridor segments with customizable greebles and edge details.',
    tags: ['Sci-Fi', 'Game Ready', 'Modular', 'Hard Surface'],
    featured: true,
  },
  {
    id: 'tree-generator',
    title: 'Parametric Forest System',
    author: 'ForestLab',
    // 森林图
    image: 'https://images.unsplash.com/photo-1448375240586-dfd8f3793300?q=80&w=800&auto=format&fit=crop',
    description: 'Parametric tree system with seasonal variations, wind animation support, and optimized LODs.',
    tags: ['Nature', 'Procedural', 'Featured'],
    featured: true,
  },
  {
    id: 'crystal-caves',
    title: 'Procedural Crystals',
    author: 'GemStudios',
    // 水晶图
    image: 'https://images.unsplash.com/photo-1515974256630-babc85765b1d?q=80&w=800&auto=format&fit=crop',
    description: 'Glowing crystal formations with procedural growth patterns and internal refraction setups.',
    tags: ['Fantasy', 'Environment', 'VDB'],
  },
  {
    id: 'mech-parts',
    title: 'Hard Surface Mech Kit',
    author: 'RobotWorks',
    // 机械零件图
    image: 'https://images.unsplash.com/photo-1535378437323-9555f374669e?q=80&w=800&auto=format&fit=crop',
    description: 'Reusable mechanical components: gears, pistons, and joints with clean topology for subdivision.',
    tags: ['Hard Surface', 'Game Ready', 'Modular'],
  },
  {
    id: 'terrain-tool',
    title: 'Erosion Simulation',
    author: 'LandscapePro',
    // 地形图
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
    description: 'Large-scale terrain generation with hydraulic erosion simulation and biome-based texturing.',
    tags: ['Environment', 'Terrain', 'Simulation'],
  },
  {
    id: 'abstract-art',
    title: 'Mathematical Sculptures',
    author: 'PolyArtist',
    // 抽象几何图
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop',
    description: 'Algorithmic art pieces using complex mathematical functions, fractals, and symmetry operations.',
    tags: ['Art', 'Abstract', 'Math'],
  },
];

export const allTags = [...new Set(showcaseItems.flatMap(item => item.tags))].sort();
