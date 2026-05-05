import React from 'react';
import Icon from '../../app/components/layout/icon';
import { ipcRenderer } from 'electron';

/**
 * Extend the CSSProperties type to include WebkitAppRegion so we can have a
 * Header that can:
 * 1. Maximize on double click
 * 2. Have working non-draggable control buttons (Maximize, Minimize, Close)
 */
interface CustomCSSProperties extends React.CSSProperties {
  WebkitAppRegion?: 'drag' | 'no-drag';
}

const OverlayWindowHeader: React.FC = () => {
  // TODO: bring show/hide hotkey from context

  const handleClose = () => {
    ipcRenderer.send('closeWindow');
  };

  //----------------------------------------------------------------------------------------------------------------
  const handleMinimize = () => {
    ipcRenderer.send('minimizeWindow');
  };

  //----------------------------------------------------------------------------------------------------------------
  return (
    <header
      className="overlay-window-header"
      style={{ WebkitAppRegion: 'drag' } as CustomCSSProperties}
    >
      <div className="logo-symbol">
        <Icon name="owSymbol" />
      </div>

      <h1 className="overlay-window-title">
        Hide/Show <span>Ctrl+H</span>
      </h1>

      <div
        className="overlay-window-actions"
        style={{ WebkitAppRegion: 'no-drag' } as CustomCSSProperties}
      >
        <button
          className="icon-btn"
          title="Minimize window"
          onClick={handleMinimize}
        >
          <Icon name="minimizeWindow" />
        </button>

        <button
          className="icon-btn close-btn"
          title="Close Window"
          onClick={handleClose}
        >
          <Icon name="closeWindow" />
        </button>
      </div>
    </header>
  );
};

export default OverlayWindowHeader;
