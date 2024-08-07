import React from 'react';
import { createRoot } from 'react-dom/client';
import '@/theme/reset.scss';
import App from '@/App.jsx';
import './i18n/i18n.js';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
