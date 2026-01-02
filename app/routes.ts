import { type RouteConfig, type RouteConfigEntry, index } from "@react-router/dev/routes";

const route: RouteConfigEntry[] = [
  {
    file: 'routes/MemoryMap.tsx',
    path: 'memoryMap'
  },
  {
    file: 'routes/Chat.tsx',
    path: 'chatWithMe'
  }
]

export default [index("routes/home.tsx"), ...route] satisfies RouteConfig;
