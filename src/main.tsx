import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LoginForm } from './layout/login-form';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoginForm />
  </StrictMode>,
);
