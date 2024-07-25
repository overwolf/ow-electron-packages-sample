import React, { FC, useContext } from 'react';
import { RecordingActions } from '../../api-actions/recording-actions';
import AppContext from '../../context/app-context';

// -----------------------------------------------------------------------------
const CaptureActions: FC = () => {
  const {
    startCapture,
    splitCapture,
    startCaptureReplay,
    startReplays,
    stopCapture,
    stopCaptureReplay,
    stopReplays,
  } = RecordingActions;

  return (
    <fieldset>
      <legend>Actions:</legend>
      <button onClick={startCapture} id="start-capture-button">
        Start Capture
      </button>
      <button onClick={stopCapture} id="stop-capture-button">
        Stop Capture
      </button>
      <button onClick={splitCapture} id="split-capture-button">
        Split
      </button>
      <br/>
      <br/>
      <button onClick={startReplays} id="start-replays-button">
        Start Replays
      </button>
      <button onClick={stopReplays} id="stop-replays-button">
        Stop Replays
      </button>
      <br/>
      <br/>
      <button onClick={startCaptureReplay} id="start-capture-replay-button">
        Start capture replay
      </button>
      <button onClick={stopCaptureReplay} id="stop-capture-replay-button">
        Stop capture replay
      </button>

    </fieldset>
  );
};
export default CaptureActions;
