import { lazy, type JSX } from 'react';

export const componentMap: Record<string, React.LazyExoticComponent<() => JSX.Element>> = {
  home: lazy(() => import('@/pages/home.page')),
  GestionarClientes: lazy(() => import('@/pages/gestion-clientes.page')),
  ControlProducto: lazy(() => import('@/pages/gestion-productos.page')),
};
