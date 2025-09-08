import { lazy, type JSX } from 'react';

export const componentMap: Record<string, React.LazyExoticComponent<() => JSX.Element>> = {
  home: lazy(() => import('@/pages/home.page')),
  GestionarClientes: lazy(() => import('@/pages/customer/gestion-clientes.page')),
  ControlProducto: lazy(() => import('@/pages/product/gestion-productos.page')),
  ReporteClientes: lazy(() => import('@/pages/customer/customer-report.tsx')),
  ReporteControl: lazy(() => import('@/pages/product/product-report')),
};
