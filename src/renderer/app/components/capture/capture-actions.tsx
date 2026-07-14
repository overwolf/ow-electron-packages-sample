import React, { FC } from 'react';
import { RecordingActions } from '../../api-actions/recording-actions';

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
    <div className='capture-actions'>
      <hr />
      <h3 className='settings-title'>Actions</h3>

      <div className='capture-actions-group'>
        <button className='btn-secondary' onClick={startCapture} id="start-capture-button">
          Start Capture
        </button>
        <button className='btn-secondary' onClick={stopCapture} id="stop-capture-button">
          Stop Capture
        </button>
        <button className='btn-secondary' onClick={splitCapture} id="split-capture-button">
          Split
        </button>
      </div>

      <div className='capture-actions-group'>
        <button className='btn-secondary' onClick={startReplays} id="start-replays-button">
          Start Replays
        </button>
        <button className='btn-secondary' onClick={stopReplays} id="stop-replays-button">
          Stop Replays
        </button>
      </div>

      <div className='capture-actions-group'>
        <button className='btn-secondary' onClick={startCaptureReplay} id="start-capture-replay-button">
          Start capture replay
        </button>
        <button className='btn-secondary' onClick={stopCaptureReplay} id="stop-capture-replay-button">
          Stop capture replay
        </button>
      </div>
    </div>
  );
};
export default CaptureActions;
