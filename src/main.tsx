import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './flat-ui/tokens.css';
import './flat-ui/flat-ui.css';
import './app.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
