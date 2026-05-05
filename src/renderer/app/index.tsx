import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import AppContextProvider from './context/app-context.provider';
import { HashRouter } from 'react-router-dom';
import Routing from './components/router/routing';
import Header from './components/layout/header';
import SideNavbar from './components/layout/side-navigation';
import AppLayout from './components/layout/Layout';
import GlobalStyles from './styles/styles';
import { SvgIcons } from './styles/icons';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <HashRouter>
    <AppContextProvider>
      <SvgIcons />
      <GlobalStyles />
      {/* <App /> */}
      <Header />
      <AppLayout />
      {/* <SideNavbar />
      <Routing /> */}
    </AppContextProvider>
  </HashRouter>,
);
