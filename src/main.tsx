import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress benign sandboxed development HMR/WebSocket rejection alerts
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  if (reason) {
    const msg = String(reason.message || reason);
    if (msg.includes('WebSocket') || msg.includes('vite') || msg.includes('hmr') || msg.includes('websocket')) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
});

window.addEventListener('error', (event) => {
  const msg = String(event.message || event.error);
  if (msg.includes('WebSocket') || msg.includes('vite') || msg.includes('hmr') || msg.includes('websocket')) {
    event.preventDefault();
    event.stopPropagation();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
