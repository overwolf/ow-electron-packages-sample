import React, { ChangeEvent, FC, useContext, useState } from 'react';
import AppContext from '../../context/app-context';
import { RecordingActions } from '../../api-actions/recording-actions';
import ToggleSwitch from '../app-settings/input-elements/toggle-switch';

// -----------------------------------------------------------------------------
const CaptureGeneral: FC = () => {
  const {
    recordingAppOptions: recordingAppOptions,
    recordingOptions,
    setRecordingOptions,
    setRecordingAppOptions,
  } = useContext(AppContext)?.recording;
  const [listenToGames, setListenToGames] = useState(false);

  return (
    <>
      <div className="settings-input-item">
        <ToggleSwitch
          id="showDebugWindow"
          labelText="Show debug window"
          checked={recordingAppOptions?.showDebugWindow ?? false}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setRecordingAppOptions({
              ...recordingAppOptions,
              showDebugWindow: e.target.checked,
            });
          }}
        />
      </div>

      <div className="settings-input-item">
        <ToggleSwitch
          id="enableDebugLogs"
          labelText="Enable debug logs"
          checked={recordingAppOptions?.enableDebugLogs ?? false}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setRecordingAppOptions({
              ...recordingAppOptions,
              enableDebugLogs: e.target.checked,
            });
          }}
        />
      </div>

      <div className="settings-input-item">
        <ToggleSwitch
          id="AutoGamesCapture"
          labelText="Auto games capture"
          checked={listenToGames}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setListenToGames(e.target.checked);
            RecordingActions.toggleAutoGameCapture(e.target.checked);
          }}
        />
      </div>

      <div className="settings-input-item">
        <ToggleSwitch
          id="ShutDownExit"
          labelText="Shut down on game exit"
          checked={recordingOptions?.autoShutdownOnGameExit ?? false}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setRecordingOptions({
              ...recordingOptions,
              autoShutdownOnGameExit: e.target.checked,
            });
          }}
        />
      </div>
    </>
  );
};
export default CaptureGeneral;
