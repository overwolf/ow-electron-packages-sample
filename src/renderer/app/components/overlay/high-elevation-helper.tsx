import React, { FC, useEffect, useState } from 'react';
import { AppActions } from '../../api-actions/app-actions';

const HighElevationHelper: FC = () => {
  const [isInstalled, setIsInstalled] = useState<boolean | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshStatus = async () => {
    try {
      setError(null);
      setIsInstalled(await AppActions.isHighElevationHelperInstalled());
    } catch (err) {
      console.error('Failed to query high elevation helper status', err);
      setError('Could not query helper status.');
      setIsInstalled(false);
    }
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  const installHelper = async () => {
    try {
      setIsInstalling(true);
      setError(null);

      const installed = await AppActions.installHighElevationHelper();
      setIsInstalled(installed);

      if (installed === false) {
        setError('The helper was not installed.');
      }
    } catch (err) {
      console.error('Failed to install high elevation helper', err);
      setError('The helper install was cancelled or failed.');
      await refreshStatus();
    } finally {
      setIsInstalling(false);
    }
  };

  const statusText =
    isInstalled === null
      ? 'Checking helper status...'
      : isInstalled
        ? 'Installed. Elevated games can be injected.'
        : 'Not installed. Elevated games will need the helper before injection can work.';

  return (
    <div className="overlay-settings-inner high-elevation-helper-settings">
      <h3 className="settings-title">High Elevation Helper</h3>
      <p className="settings-sub-title">
        Install this one-time helper so the overlay can inject into games that
        run as administrator.
      </p>

      <div className="settings-row">
        <div className="settings-input-item helper-status-row">
          <span className={`helper-status ${isInstalled ? 'is-installed' : ''}`}>
            {statusText}
          </span>

          <button
            type="button"
            onClick={installHelper}
            disabled={isInstalling || isInstalled === true}
          >
            {isInstalled ? 'Installed' : isInstalling ? 'Installing...' : 'Install Helper'}
          </button>
        </div>
      </div>

      {error ? <p className="helper-error">{error}</p> : null}
    </div>
  );
};

export default HighElevationHelper;
