import { type RouteConfig, type RouteConfigEntry, index } from "@react-router/dev/routes";

const route: RouteConfigEntry[] = [
  {
    file: 'routes/MemoryMap.tsx',
    path: 'memoryMap'
  }
]

export default [index("routes/home.tsx"), ...route] satisfies RouteConfig;
