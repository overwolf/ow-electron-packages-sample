import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import OnOffToggleSwitch from '../../app/components/app-settings/input-elements/on-off-toggle-switch';
import { OsrActions } from '../../app/api-actions/osr-actions';

const OverlayWindowSettings: React.FC = () => {
  const [passThroughState, setPassThroughState] =
    useState<string>('noPassThrough');

  const handlePassthrough = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked ? 'passThrough' : 'noPassThrough';

    // We're using ipcRenderer directly here to ensure the message is sent from
    // the specific overlay window we want to control.
    ipcRenderer.send('setPassthrough', value);
    console.log(`- osr setPassthrough ${value}`);
    setPassThroughState(value);
  };
  //----------------------------------------------------------------------------

  const [isActive, setIsActive] = useState<string>('default');

  const handlePosition = (value: string) => {
    // We're using ipcRenderer directly here to ensure the message is sent from
    // the specific overlay window we want to control.
    ipcRenderer.send('setZorder', value);
    console.log(`- osr position ${value}`);
    setIsActive(value);
  };
  //-----------------------------------------------------------------------------

  useEffect(() => {
    const passthroughResetFromHotkey = (_event: any, data: any) => {
      console.log('Received passthrough-reset in overlay window settings');
      setPassThroughState('noPassThrough');
    };

    ipcRenderer.on('passthrough-reset', passthroughResetFromHotkey);

    const zOrderResetFromHotkey = (_event: any, data: any) => {
      console.log('Received zOrder-reset in overlay window settings');
      setIsActive('default');
    };

    ipcRenderer.on('zOrder-reset', zOrderResetFromHotkey);

    // Todo: set handler for cycling between z-order states

    return () => {
      ipcRenderer.removeListener(
        'passthrough-reset',
        passthroughResetFromHotkey,
      );
      ipcRenderer.removeListener('zOrder-reset', zOrderResetFromHotkey);
    };
  }, []);
  //-----------------------------------------------------------------------------

  return (
    <section className="overlay-window-settings">
      <h2 className="overlay-window-title">Overlay window settings</h2>
      <div className="overlay-settings-inner">
        <div className="overlay-window-settings-item">
          <label className="overlay-label">
            Input passthrough <span>Ctrl+R</span>
          </label>
          <OnOffToggleSwitch
            id={'passthrough'}
            isChecked={passThroughState === 'passThrough'}
            onChange={(e) => handlePassthrough(e)}
          />
        </div>

        <div className="overlay-positions">
          <label className="overlay-label">
            Overlay position <span>Ctrl+Z</span>
          </label>
          <div className="position-actions">
            <button
              className={`btn-secondary ${
                isActive == 'default' ? 'is-active' : ''
              }`}
              onClick={() => handlePosition('default')}
            >
              Focus
            </button>

            <button
              className={`btn-secondary ${
                isActive == 'topMost' ? 'is-active' : ''
              }`}
              onClick={() => handlePosition('topMost')}
            >
              Topmost
            </button>

            <button
              className={`btn-secondary ${
                isActive == 'bottomMost' ? 'is-active' : ''
              }`}
              onClick={() => handlePosition('bottomMost')}
            >
              Bottommost
            </button>
          </div>
        </div>
      </div>
      <hr />
    </section>
  );
};

export default OverlayWindowSettings;
