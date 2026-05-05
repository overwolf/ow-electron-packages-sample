import React, { ChangeEvent, FC, useContext } from 'react';
import CaptureVideoEncoderAdvancedSettings from './capture-video-encoder-advanced-settings';
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
  const onBitrateChanged = () => {
    const bitrate = document.getElementById('bitrateRange') as HTMLInputElement;
    let parsedValue = parseFloat(bitrate.value);

    // If the parsedValue is not a number or less than 0, do nothing
    if (isNaN(parsedValue) || parsedValue < 0) {
      return;
    }

    // If the parsedValue hasn't changed, do nothing
    if (parsedValue === captureSettings.videoEncoderSettings.bitrate) {
      return;
    }

    setCaptureSettings({
      ...captureSettings,
      videoEncoderSettings: {
        ...captureSettings.videoEncoderSettings,
        bitrate: parsedValue,
      },
    });
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

      <div className="settings-input-item">
        <RangeSlider
          label={`Bitrate: ${captureSettings?.videoEncoderSettings?.bitrate} kbps`}
          showNumberInput={false}
          title={`Bitrate: ${
            captureSettings?.videoEncoderSettings?.bitrate ?? 1
          } `}
          rangeInputProps={{
            id: 'bitrateRange',
            name: 'bitrate',
            min: '2500',
            max: '100000',
            step: '10',
            defaultValue:
              captureSettings?.videoEncoderSettings?.bitrate.toString() ??
              '8000',
            onMouseUp: () => {
              onBitrateChanged();
            },
          }}
        />
      </div>

      <ShowMoreOptions>
        <CaptureVideoEncoderAdvancedSettings />
      </ShowMoreOptions>
    </>
  );
};
export default CaptureVideoEncoderSettings;
