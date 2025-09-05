import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { AppSidebar } from './components/app-sidebar';
import { Button } from '@/components/ui/button';
import { HomeIcon } from 'lucide-react';

export default function Dashboard() {
  const routerState = useRouterState();

  const getCurrentRoute = () => {
    const path = routerState.location.pathname;
    if (path === '/home' || path === '/') return 'Home';
    return path.slice(1).charAt(0).toUpperCase() + path.slice(2);
  };

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-10 items-center justify-between">
            <div className="flex items-center">
              <SidebarTrigger className="h-10 w-12" />
              <Button variant="outline" className="bg-transparent shadow-none border-none">
                <Link to="/home">
                  <HomeIcon />
                </Link>
              </Button>
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink> {'Asiservy'} </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{getCurrentRoute()}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center pr-50"></div>

            <div className="flex items-center pr-2"></div>
          </header>
          <main className="p-4">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
