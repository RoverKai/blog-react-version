import { type RouteConfig, type RouteConfigEntry, index } from "@react-router/dev/routes";

const route: RouteConfigEntry[] = [
  {
    file: 'routes/custom.tsx',
    path: 'custom'
  },
  {
    file: 'routes/test.tsx',
    path: 'test'
  }
]

export default [index("routes/home.tsx"), ...route] satisfies RouteConfig;
