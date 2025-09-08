import { lazy } from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  Navigate,
  redirect,
} from '@tanstack/react-router';
import { componentMap } from './generate-routes';
import { authStore } from '@/store/usuario.store';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: lazy(() => import('@/layout/auth.page')),
  beforeLoad: () => {
    if (authStore.state.autenticado) {
      throw redirect({ to: '/home' });
    }
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'dashboard',
  component: lazy(() => import('@/layout/dashboard.page')),
  beforeLoad: () => {
    if (!authStore.state.autenticado) {
      throw redirect({ to: '/login' });
    }
  },
});

const indexRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/',
  component: () => <Navigate to="/home" />,
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
  dashboardRoute.addChildren([indexRoute, homeRoute, ...dynamicRoutes]),
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
