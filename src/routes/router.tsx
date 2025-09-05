import { lazy } from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  Navigate,
} from '@tanstack/react-router';
import { componentMap } from './generate-routes';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: lazy(() => import('@/layout/auth.page')),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: lazy(() => import('@/layout/dashboard.page')),
});

const dynamicRoutes = Object.keys(componentMap)
  .filter((routePath) => routePath !== 'home')
  .map((routePath) => {
    return createRoute({
      getParentRoute: () => dashboardRoute,
      path: `/${routePath}`,
      component: componentMap[routePath],
    });
  });

const homeRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/home',
  component: componentMap['home'],
});

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '$',
  component: () => <Navigate to="/home" />,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  dashboardRoute.addChildren([homeRoute, ...dynamicRoutes]),
  notFoundRoute,
]);

export const router = createRouter({
  routeTree,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
