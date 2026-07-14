import React, { ChangeEvent, FC, useContext } from 'react';
import CaptureVideoEncoderAdvancedSettings from './capture-video-encoder-advanced-settings';
import {
  BITRATE_DEFAULT,
  BITRATE_MAX,
  BITRATE_MIN,
  BITRATE_PRESETS,
} from './constants';
import { kSupportedEncodersTypes } from '@overwolf/ow-electron-packages-types';
import AppContext from '../../context/app-context';
import RangeSlider from '../app-settings/input-elements/range-slider';
import ShowMoreOptions from '../app-settings/show-more-options';

const CaptureVideoEncoderSettings: FC = () => {
  const {
    captureSettings,
    setCaptureSettings,
    captureSettingsOptions,
    setCaptureSettingsOptions,
    recordingInfo,
  } = useContext(AppContext)?.recording;

  //----------------------------------------------------------------------------
  const currentBitrate =
    captureSettings?.videoEncoderSettings?.bitrate ?? BITRATE_DEFAULT;

  const setBitrate = (bitrate: number) => {
    if (bitrate === captureSettings.videoEncoderSettings.bitrate) {
      return;
    }

    setCaptureSettings({
      ...captureSettings,
      videoEncoderSettings: {
        ...captureSettings.videoEncoderSettings,
        bitrate,
      },
    });
  };

  const onBitrateChanged = (e: ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseFloat(e.target.value);

    if (isNaN(parsedValue) || parsedValue < 0) {
      return;
    }

    setBitrate(parsedValue);
  };

  //----------------------------------------------------------------------------
  const onVideoEncoderChanged = (e: ChangeEvent<HTMLSelectElement>) => {
    let value = e.target.value as kSupportedEncodersTypes;
    setCaptureSettings({
      ...captureSettings,
      videoEncoderSettings: {
        ...captureSettings.videoEncoderSettings,
        type: value,
      },
    });

    setCaptureSettingsOptions({
      ...captureSettingsOptions,
      videoEncoder: value,
    });
  };
  //----------------------------------------------------------------------------

  return (
    <>
      <div className="settings-input-item">
        <label htmlFor="video-encoders">Video Encoder</label>
        <select
          id="video-encoders"
          value={captureSettingsOptions?.videoEncoder ?? ''}
          onChange={onVideoEncoderChanged}
        >
          {recordingInfo?.video?.encoders?.map((encoder) => (
            <option
              key={encoder.name}
              label={encoder.name}
              value={encoder.type}
            />
          ))}
        </select>
      </div>

      <div className="settings-input-item bitrate-control">
        <div className="bitrate-control-inner">
          <RangeSlider
            label={`Bitrate: ${currentBitrate} kbps`}
            showNumberInput={false}
            title={`Bitrate: ${currentBitrate} kbps`}
            rangeInputProps={{
              id: 'bitrateRange',
              name: 'bitrate',
              min: BITRATE_MIN.toString(),
              max: BITRATE_MAX.toString(),
              step: '10',
              value: currentBitrate,
              onChange: onBitrateChanged,
            }}
          />
          <div className="bitrate-presets">
            {BITRATE_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                className={`btn-secondary ${
                  currentBitrate === preset ? 'is-active' : ''
                }`}
                onClick={() => setBitrate(preset)}
              >
                {preset.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ShowMoreOptions>
        <CaptureVideoEncoderAdvancedSettings />
      </ShowMoreOptions>
    </>
  );
};
export default CaptureVideoEncoderSettings;
