import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializePerformanceOptimization } from './utils/performance';

// Initialize performance optimizations
initializePerformanceOptimization();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// Remove loading fallback
const loadingElement = rootElement.querySelector('.loading-spinner')?.parentElement;
if (loadingElement) {
  loadingElement.style.display = 'none';
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
