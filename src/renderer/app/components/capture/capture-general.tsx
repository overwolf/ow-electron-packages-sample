import React, { ChangeEvent, FC, useContext, useState } from 'react';
import AppContext from '../../context/app-context';
import { RecordingActions } from '../../api-actions/recording-actions';

// -----------------------------------------------------------------------------
const CaptureGeneral: FC = () => {
  const {
    recordingAppOptions: recordingAppOptions,
    recordingOptions,
    setRecordingOptions,
    setRecordingAppOptions,
  } = useContext(AppContext)?.recording;
  const [listenToGames, setListenToGames] = useState(true);

  return (
    <fieldset>
      <legend>General:</legend>
      <label>
        <input
          type="checkbox"
          checked={recordingAppOptions?.showDebugWindow ?? false}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setRecordingAppOptions({
              ...recordingAppOptions,
              showDebugWindow: e.target.checked,
            });
          }}
        />
        Show Debug Window
      </label>

      <label>
        <input
          type="checkbox"
          checked={recordingAppOptions?.enableDebugLogs ?? false}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setRecordingAppOptions({
              ...recordingAppOptions,
              enableDebugLogs: e.target.checked,
            });
          }}
        />
        Enable Debug Logs
      </label>
      <br />

      <label>
        <input
          type="checkbox"
          checked={listenToGames}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setListenToGames(e.target.checked);
            RecordingActions.toggleAutoGameCapture(e.target.checked);
          }}
        />
        Auto games Capture
      </label>
      <br />
      <label>
        <input
          type="checkbox"
          checked={recordingOptions?.autoShutdownOnGameExit ?? false}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setRecordingOptions({
              ...recordingOptions,
              autoShutdownOnGameExit: e.target.checked,
            });
          }}
        />
        Shut Down on game Exit
      </label>
    </fieldset>
  );
};
export default CaptureGeneral;
