import { lazy } from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Navigate,
  Outlet,
} from '@tanstack/react-router';
import { componentMap } from './generate-routes';

// Crear la ruta raíz
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Ruta de login
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: lazy(() => import('@/layout/auth.page')),
});

// Ruta principal del dashboard
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: lazy(() => import('@/layout/dashboard.page')),
});

// Crear rutas dinámicas basadas en componentMap
const dynamicRoutes = Object.keys(componentMap)
  .filter((routePath) => routePath !== 'home')
  .map((routePath) => {
    return createRoute({
      getParentRoute: () => dashboardRoute,
      path: `/${routePath}`,
      component: componentMap[routePath],
    });
  });

// Ruta /home
const homeRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/home',
  component: lazy(() => import('@/pages/home.page')),
});

// Ruta catch-all para redirección
const notFoundRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '*',
  component: () => <Navigate to="/home" />,
});

// Crear el árbol de rutas
const routeTree = rootRoute.addChildren([
  loginRoute,
  dashboardRoute.addChildren([homeRoute, ...dynamicRoutes, notFoundRoute]),
]);

// Crear y exportar el router
export const router = createRouter({
  routeTree,
});

// Declarar el tipo del router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
