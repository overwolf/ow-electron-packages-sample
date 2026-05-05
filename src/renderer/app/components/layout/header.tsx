import React from 'react';
import Icon from './icon';

/**
 * Extend the CSSProperties type to include WebkitAppRegion so we can have a
 * Header that can:
 * 1. Maximize on double click
 * 2. Have working non-draggable control buttons (Maximize, Minimize, Close)
 */
interface CustomCSSProperties extends React.CSSProperties {
  WebkitAppRegion?: 'drag' | 'no-drag';
}

const Header = () => {
  const [isMaximized, setIsMaximized] = React.useState(false);

  //----------------------------------------------------------------------------
  const handleMaximize = async () => {
    try {
      if (isMaximized) {
        window.electronAPI.unmaximize();
        setIsMaximized(false);
      } else {
        window.electronAPI.maximize();
        console.log('maximize');

        setIsMaximized(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //----------------------------------------------------------------------------------------------------------------
  const handleClose = async () => {
    try {
      window.electronAPI.close();
    } catch (error) {
      console.log(error);
    }
  };

  //----------------------------------------------------------------------------------------------------------------
  const handleMinimize = async () => {
    try {
      window.electronAPI.minimize();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header 
      className='header' 
      style={{WebkitAppRegion: 'drag'} as CustomCSSProperties}
    >
      <h1 title='electron sample app'>
        <Icon name="owLogo" className='logo' />
        <Icon name="appName" className='app-name' />
      </h1>

      <div
        className='window-actions'
        style={{ WebkitAppRegion: 'no-drag'} as CustomCSSProperties }
      >
        <button
          className='icon-btn'
          title='Minimize window'
          onClick={handleMinimize}
        >
          <Icon name="minimizeWindow" />
        </button>

        <button
          className='icon-btn'
          title='Maximize window'
          onClick={handleMaximize}
        >
          <Icon name="maximizeWindow" />
        </button>

        <button
          className='icon-btn close-btn'
          title='Close App'
          onClick={handleClose}
        >
          <Icon name="closeWindow" />
        </button>

      </div>
    </header>
  );
};

export default Header;
