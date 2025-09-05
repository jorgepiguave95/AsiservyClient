'use client';

import * as React from 'react';
import { Frame, PieChart } from 'lucide-react';

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
      name: 'Design Engineering',
      icon: Frame,
      items: [
        {
          name: 'UI Components',
          url: '/components',
          icon: Frame,
        },
        {
          name: 'Design System',
          url: '/design-system',
          icon: Frame,
        },
        {
          name: 'Figma Files',
          url: '/figma',
          icon: Frame,
        },
      ],
    },
    {
      name: 'Sales & Marketing',
      icon: PieChart,
      items: [
        {
          name: 'Analytics',
          url: '/analytics',
          icon: PieChart,
        },
        {
          name: 'Campaigns',
          url: '/campaigns',
          icon: PieChart,
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
