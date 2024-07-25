import React, { FC } from 'react';
import CaptureActions from './capture-actions';
import CaptureVideo from './capture-video';
import CaptureAudio from './capture-audio';
import CaptureOutputGeneral from './capture-output-general';
import CaptureSplitting from './capture-splitting';
import CaptureGeneral from './capture-general';
import CaptureReplayCapture from './capture-replay-capture';
import CaptureReplay from './capture-replay';
import CaptureStatus from './capture-status';

// -----------------------------------------------------------------------------
const Capture: FC = () => {
  return (
    <div>
      <fieldset>
        <legend>Capture:</legend>
        <span style={{display: 'flex'}}>
          <CaptureActions />
          <CaptureStatus />
        </span>
        <div style={{ display: 'flex' }}>
          <CaptureGeneral />
          <CaptureSplitting />
          <CaptureReplayCapture />
          <CaptureReplay />
        </div>
      </fieldset>

      <fieldset style={{ display: 'flex' }}>
        <legend>Output Settings</legend>
        <CaptureOutputGeneral />
        <CaptureVideo />
        <CaptureAudio />
      </fieldset>
    </div>
  );
};

export default Capture;
