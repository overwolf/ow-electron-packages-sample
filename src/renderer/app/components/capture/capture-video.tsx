import React, { ChangeEvent, FC, useContext, useState } from 'react';
import { kFileFormat } from '@overwolf/ow-electron-packages-types';
import AppContext from '../../context/app-context';
import CaptureVideoEncoderSettings from './capture-video-encoder-settings';
import { outputFileFormat, fpsOptions } from './constants';

const CaptureVideo: FC = () => {
  const {
    captureSettings,
    setCaptureSettings,
    recordingOptions,
    setRecordingOptions,
  } = useContext(AppContext)?.recording;

  const onVideoSettingsChanged = (
    e: ChangeEvent,
    type: 'string' | 'number',
  ) => {
    let { value, name } = e.target as any;
    let videoSettings = captureSettings.videoSettings;

    videoSettings[name] = type === 'number'
      ? parseInt(value) ? parseInt(value) : videoSettings[name]
      : value;

    setCaptureSettings({
      ...captureSettings,
      videoSettings,
    });
  };

  const onVideoFPSChanged = (e: ChangeEvent) => {
    let { value, name, checked } = e.target as any;
    if (!checked) {
      return;
    }

    let videoSettings = captureSettings?.videoSettings;
    videoSettings[name] = parseInt(value) ? parseInt(value) : videoSettings[name];
    setCaptureSettings({
      ...captureSettings,
      videoSettings,
    });
  };

  return (
    <fieldset>
      <legend>Video:</legend>
      <label htmlFor="video-output-format">Output Format: </label>
      <select
        id="video-output-format"
        value={recordingOptions?.fileFormat}
        onChange={(e) => {
          let value = e.target.value as kFileFormat;
          setRecordingOptions({
            ...recordingOptions,
            fileFormat: value,
          });
        }}
      >
        {outputFileFormat?.map((format) => (
          <option key={format} label={format} value={format} />
        ))}
      </select>
      <br />

      <label>
        {fpsOptions.map((o) => {
          return (
            <span key={o}>
              {`fps: ${o}`}
              <input
                key={o}
                type="radio"
                name="fps"
                onChange={onVideoFPSChanged}
                value={o}
                checked={captureSettings?.videoSettings?.fps === o}
              />
            </span>
          );
        })}
      </label>
      <br />
      <label>
        Base Width: 
        <input
          type="text"
          name="baseWidth"
          onChange={(e) => onVideoSettingsChanged(e, 'number')}
          value={captureSettings?.videoSettings?.baseWidth ?? ''}
        />
        <br />
        Base Height: 
        <input
          type="text"
          name="baseHeight"
          onChange={(e) => onVideoSettingsChanged(e, 'number')}
          value={captureSettings?.videoSettings?.baseHeight ?? ''}
        />
      </label>
      <br />
      <label>
        Output Width: 
        <input
          type="text"
          name="outputWidth"
          onChange={(e) => onVideoSettingsChanged(e, 'number')}
          value={captureSettings?.videoSettings?.outputWidth ?? ''}
        />
        <br />
        Output Height: 
        <input
          type="text"
          name="outputHeight"
          onChange={(e) => onVideoSettingsChanged(e, 'number')}
          value={captureSettings?.videoSettings?.outputHeight ?? ''}
        />
      </label>
      <br />
      <CaptureVideoEncoderSettings />
    </fieldset>
  );
};
export default CaptureVideo;
