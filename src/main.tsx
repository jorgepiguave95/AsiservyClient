import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import { TooltipProvider } from './components/ui/tooltip';
import { AppRouter } from './routes/app-router';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppRouter />
        <Toaster
          richColors
          toastOptions={{
            classNames: {
              success: '!bg-emerald-700 !text-white !border !border-emerald-900',
              error: '!bg-red-600 !text-white !border !border-red-800',
              warning: '!bg-yellow-200 !text-black !border !border-yellow-700',
              info: '!bg-sky-600 !text-white !border !border-sky-800',
            },
          }}
        />
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>,
);
