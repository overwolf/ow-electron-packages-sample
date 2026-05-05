import React, { ChangeEvent, FC, useContext, useState } from 'react';
import { kFileFormat } from '@overwolf/ow-electron-packages-types';
import AppContext from '../../context/app-context';
import { outputFileFormat, fpsOptions } from './constants';
import AnyTypeInput from '../app-settings/input-elements/any-type-input';

const CaptureVideo: FC = () => {
  const {
    captureSettings,
    setCaptureSettings,
    recordingOptions,
    setRecordingOptions,
  } = useContext(AppContext)?.recording;

  //----------------------------------------------------------------------------
  const handleResolutionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const videoSettings = { ...captureSettings.videoSettings };

    const parsedValue = parseInt(value);

    if (value === '') {
      if (name === 'outputWidth' || name === 'outputHeight') {
        // If User cleared the output value, we delete it
        // to allow the recorder to use the default value
        delete videoSettings[name];
      } else {
        return;
      }
    } else if (!isNaN(parsedValue)) {
      if (parsedValue < 0 || parsedValue > 3840) {
        // Validation for resolution values
        // Assuming max resolution is of a 4K monitor
        console.error(`Value for ${name} must be between 0 and 3840:`, value);
        return;
      }

      if (name === 'outputWidth' || name === 'outputHeight') {
        // If the value is 0, we delete it to allow the recorder to use the default value
        // Otherwise, we set the value
        if (parsedValue === 0) {
          delete videoSettings[name];
        } else {
          videoSettings[name] = parsedValue;
        }
      } else if (name === 'baseWidth' || name === 'baseHeight') {
        videoSettings[name] = parsedValue;
      }
    } else {
      console.error(`Invalid value for ${name}:`, value);
      return;
    }

    setCaptureSettings({
      ...captureSettings,
      videoSettings,
    });
  };
  //----------------------------------------------------------------------------
  const handleOutputFormatChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    let selectValue = e.target.value as kFileFormat;
    let videoSettings = recordingOptions?.fileFormat;

    videoSettings = selectValue;

    setRecordingOptions({
      ...recordingOptions,
      fileFormat: videoSettings,
    });
  };
  //----------------------------------------------------------------------------
  const handleFpsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let selectValue = e.target.value;
    let parsedValue = parseInt(selectValue);
    let videoSettings = captureSettings?.videoSettings;

    if (isNaN(parsedValue)) {
      console.error('Invalid FPS value selected:', selectValue);
      return;
    }

    videoSettings.fps = parsedValue;

    setCaptureSettings({
      ...captureSettings,
      videoSettings,
    });
  };
  //----------------------------------------------------------------------------

  return (
    <>
      <div className="settings-input-item">
        <label htmlFor="video-output-format">Output format</label>
        <select
          id="video-output-format"
          // value={recordingOptions?.fileFormat}
          defaultValue={recordingOptions?.fileFormat ?? ''}
          onChange={(e) => {
            handleOutputFormatChange(e);
          }}
        >
          {outputFileFormat?.map((format) => (
            <option key={format} label={format} value={format} />
          ))}
        </select>
      </div>

      <div className="settings-input-item">
        <label htmlFor="fps">FPS</label>
        <select
          id="fps"
          onChange={(e) => {
            handleFpsChange(e);
          }}
          defaultValue={captureSettings?.videoSettings?.fps ?? ''}
        >
          {fpsOptions?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <div className="settings-input-item">
        <AnyTypeInput
          id="baseWidth"
          labelText="Base width"
          name="baseWidth"
          type="number"
          onBlur={(e) => handleResolutionChange(e)}
          defaultValue={captureSettings?.videoSettings?.baseWidth ?? ''}
        />
      </div>

      <div className="settings-input-item">
        <AnyTypeInput
          id="baseHeight"
          labelText="Base height"
          name="baseHeight"
          type="number"
          onBlur={(e) => handleResolutionChange(e)}
          defaultValue={captureSettings?.videoSettings?.baseHeight ?? ''}
        />
      </div>

      <div className="settings-input-item">
        <AnyTypeInput
          id="outputWidth"
          labelText="Output width"
          name="outputWidth"
          type="number"
          onBlur={(e) => handleResolutionChange(e)}
          defaultValue={captureSettings?.videoSettings?.outputWidth ?? ''}
        />
      </div>

      <div className="settings-input-item">
        <AnyTypeInput
          id="outputHeight"
          labelText="Output height"
          name="outputHeight"
          type="number"
          onBlur={(e) => handleResolutionChange(e)}
          defaultValue={captureSettings?.videoSettings?.outputHeight ?? ''}
        />
      </div>
    </>
  );
};
export default CaptureVideo;
