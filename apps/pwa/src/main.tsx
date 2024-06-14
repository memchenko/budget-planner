import 'reflect-metadata';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App.tsx';
import './configs/inversify.config.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
