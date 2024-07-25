import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import AppContextProvider from './context/app-context.provider';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <AppContextProvider>
    <App />
  </AppContextProvider>,
);
