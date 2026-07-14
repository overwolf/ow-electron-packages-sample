import React, { ChangeEvent, FC, useContext, useState } from 'react';
import { kFileFormat } from '@overwolf/ow-electron-packages-types';
import AppContext from '../../context/app-context';
import { outputFileFormat, fpsOptions, RESOLUTION_PRESETS, ResolutionPreset } from './constants';
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
  const setBaseResolution = (preset: ResolutionPreset) => {
    setCaptureSettings({
      ...captureSettings,
      videoSettings: {
        ...captureSettings.videoSettings,
        baseWidth: preset.width,
        baseHeight: preset.height,
      },
    });
  };

  const clearBaseResolution = () => {
    const videoSettings = { ...captureSettings.videoSettings };
    delete videoSettings.baseWidth;
    delete videoSettings.baseHeight;
    setCaptureSettings({ ...captureSettings, videoSettings });
  };

  const setOutputResolution = (preset: ResolutionPreset) => {
    const videoSettings = { ...captureSettings.videoSettings };
    videoSettings.outputWidth = preset.width;
    videoSettings.outputHeight = preset.height;
    setCaptureSettings({ ...captureSettings, videoSettings });
  };

  const clearOutputResolution = () => {
    const videoSettings = { ...captureSettings.videoSettings };
    delete videoSettings.outputWidth;
    delete videoSettings.outputHeight;
    setCaptureSettings({ ...captureSettings, videoSettings });
  };

  const currentBaseWidth = captureSettings?.videoSettings?.baseWidth;
  const currentBaseHeight = captureSettings?.videoSettings?.baseHeight;
  const currentOutputWidth = captureSettings?.videoSettings?.outputWidth;
  const currentOutputHeight = captureSettings?.videoSettings?.outputHeight;

  const isBasePresetActive = (preset: ResolutionPreset) =>
    currentBaseWidth === preset.width && currentBaseHeight === preset.height;

  const isOutputPresetActive = (preset: ResolutionPreset) =>
    currentOutputWidth === preset.width && currentOutputHeight === preset.height;
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
          key={`baseWidth-${currentBaseWidth}`}
          id="baseWidth"
          labelText="Base width"
          name="baseWidth"
          type="number"
          onBlur={(e) => handleResolutionChange(e)}
          defaultValue={currentBaseWidth ?? ''}
        />
      </div>

      <div className="settings-input-item">
        <AnyTypeInput
          key={`baseHeight-${currentBaseHeight}`}
          id="baseHeight"
          labelText="Base height"
          name="baseHeight"
          type="number"
          onBlur={(e) => handleResolutionChange(e)}
          defaultValue={currentBaseHeight ?? ''}
        />
      </div>

      <div className="settings-input-item">
        <label>Base resolution presets</label>
        <div className="resolution-presets">
          {RESOLUTION_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className={`btn-secondary ${isBasePresetActive(preset) ? 'is-active' : ''}`}
              onClick={() => setBaseResolution(preset)}
            >
              {preset.label}
            </button>
          ))}
          <button
            type="button"
            className="btn-secondary preset-clear"
            onClick={clearBaseResolution}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="settings-input-item">
        <AnyTypeInput
          key={`outputWidth-${currentOutputWidth}`}
          id="outputWidth"
          labelText="Output width"
          name="outputWidth"
          type="number"
          onBlur={(e) => handleResolutionChange(e)}
          defaultValue={currentOutputWidth ?? ''}
        />
      </div>

      <div className="settings-input-item">
        <AnyTypeInput
          key={`outputHeight-${currentOutputHeight}`}
          id="outputHeight"
          labelText="Output height"
          name="outputHeight"
          type="number"
          onBlur={(e) => handleResolutionChange(e)}
          defaultValue={currentOutputHeight ?? ''}
        />
      </div>

      <div className="settings-input-item">
        <label>Output resolution presets</label>
        <div className="resolution-presets">
          {RESOLUTION_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className={`btn-secondary ${isOutputPresetActive(preset) ? 'is-active' : ''}`}
              onClick={() => setOutputResolution(preset)}
            >
              {preset.label}
            </button>
          ))}
          <button
            type="button"
            className="btn-secondary preset-clear"
            onClick={clearOutputResolution}
          >
            Clear
          </button>
        </div>
      </div>
    </>
  );
};
export default CaptureVideo;
