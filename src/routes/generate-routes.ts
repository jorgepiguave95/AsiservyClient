import { lazy, type JSX } from 'react';

export const componentMap: Record<string, React.LazyExoticComponent<() => JSX.Element>> = {
  home: lazy(() => import('@/pages/home.page')),
};
