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
import SettingsOptionItem, { SettingsItemProps } from '../app-settings/app-settings-item';
import CaptureVideoEncoderSettings from './capture-video-encoder-settings';

const Capture: FC = () => {

  const CaptureGroup: React.FC = () => (
    <div className='settings-group'>
      <div className='settings-group-col left-col'>
        <h3 className='settings-title'>General</h3>
        <CaptureGeneral />
      </div>

      <div className='settings-group-col right-col'>
        <h3 className='settings-title'>Replay options</h3>
        <CaptureReplay />
        <CaptureReplayCapture />
      </div>
    </div>
  );

// -----------------------------------------------------------------------------
  const OutputGroup: React.FC = () => (
    <div className='settings-group-row-col-col'>

      <div className='settings-full-col'>
        <h3 className='settings-title'>General</h3>
        <CaptureOutputGeneral />
      </div>

      <div className='settings-group-col left-col'>
        <h3 className='settings-title'>Video</h3>
        <CaptureVideo />
        <h3 className='settings-title'>Video encoder settings</h3>
        <CaptureVideoEncoderSettings />
      </div>

      <div className='settings-group-col right-col'>
        <h3 className='settings-title'>Audio</h3>
        <CaptureAudio />
        <h3 className='settings-title'>Splitting</h3>
        <CaptureSplitting />
        <CaptureStatus />
        <CaptureActions />
      </div>
      
    </div>
  );

// -----------------------------------------------------------------------------
  const recordingSettingsItems: SettingsItemProps[] = [
    {
      type: 'expanded-type',
      title: 'Capture',
      description: 'General settings, replay options',
      content: <CaptureGroup />,
      isExpanded: true,
    },
    {
      type: 'expanded-type',
      title: 'Output',
      description: 'General settings, video, audio',
      content: <OutputGroup />,
      isExpanded: true,
    },
  ];



// -----------------------------------------------------------------------------
  return (
    <ul className='settings-options-list'>
      {recordingSettingsItems.map((item, index) => (
        <SettingsOptionItem key={index} {...item} />
      ))}
    </ul>
  );
};

export default Capture;
