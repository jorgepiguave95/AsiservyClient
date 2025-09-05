'use client';

import * as React from 'react';
import {
  CalendarPlus,
  FileChartColumn,
  FileUser,
  SlidersHorizontal,
  UserCogIcon,
  Users,
} from 'lucide-react';

import { NavProjects } from '@/layout/components/nav-projects';
import { NavUser } from '@/layout/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

const data = {
  user: {
    name: 'Cristian Molina',
    email: 'cmolina@asiservy.com',
    avatar: '/avatars/shadcn.jpg',
  },
  menu: [
    {
      name: 'Clientes',
      icon: Users,
      items: [
        {
          name: 'Gestionar Clientes',
          url: '/GestionarClientes',
          icon: UserCogIcon,
        },
        {
          name: 'Reporte Clientes',
          url: '/ReporteClientes',
          icon: FileUser,
        },
      ],
    },
    {
      name: 'Gestion de Producto',
      icon: SlidersHorizontal,
      items: [
        {
          name: 'Control de Producto',
          url: '/ControlProducto',
          icon: CalendarPlus,
        },
        {
          name: 'Reporte de Control',
          url: '/ReporteControl',
          icon: FileChartColumn,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.menu} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
