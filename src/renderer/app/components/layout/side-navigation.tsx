import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from './icon';
import { AppActions } from '../../api-actions/app-actions';

function SideNavbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className='side-bar'>

      <nav className='main-menu'>
        <ul>
          <li className={isActive('/') ? 'is-active': ''}>
            <Link to="/">
              <Icon name="logger" /> Logger
            </Link>
          </li>
          <li className={isActive('/ads-tester') ? 'is-active': ''}>
            <Link to="/ads-tester">
              <Icon name="adLayout" /> Ads Tester
            </Link>
          </li>
          <li className={
              isActive('/app-settings') || isActive('/recording-settings') ? 'is-active': ''
            }>
            <Link to="/app-settings">
              <Icon name="appSettings" /> App Settings
            </Link>
          </li>
        </ul>
      </nav>

      <span className='electron-version'>{AppActions.version.replace('ow-electron ', '')}</span>

    </aside>
  );
}

export default SideNavbar;
