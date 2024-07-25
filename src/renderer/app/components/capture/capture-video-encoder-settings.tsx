import React, { ChangeEvent, FC, useContext, useState } from 'react';
import CaptureVideoEncoderAdvancedSettings from './capture-video-encoder-advanced-settings';
import { kSupportedEncodersTypes } from '@overwolf/ow-electron-packages-types';
import AppContext from '../../context/app-context';

const CaptureVideoEncoderSettings: FC = () => {
  const {
    captureSettings,
    setCaptureSettings,
    captureSettingsOptions,
    setCaptureSettingsOptions,
    recordingInfo,
  } = useContext(AppContext)?.recording;

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const onVideoEncoderSettingChanged = (e: ChangeEvent<HTMLInputElement>) => {
    let { value, name, checked } = e.target as any;
    let videoEncoderSettings = captureSettings.videoEncoderSettings;
    videoEncoderSettings[name] = checked ? checked : value;
    setCaptureSettings({
      ...captureSettings,
      videoEncoderSettings,
    });

    setCaptureSettings({ ...captureSettings, videoEncoderSettings });
  };

  const onVideoEncoderChanged = (e: ChangeEvent<HTMLSelectElement>) => {
    let value = e.target.value as kSupportedEncodersTypes;
      setCaptureSettings({
        ...captureSettings,
        videoEncoderSettings: {type : value}
      })

    setCaptureSettingsOptions({
      ...captureSettingsOptions,
      videoEncoder: value,
    });
  };

  return (
    <fieldset>
      <legend>Video Encoder Settings:</legend>

      <label>
        <input
          type="checkbox"
          checked={showAdvanced}
          onChange={(e) => setShowAdvanced(e.target.checked)}
          />
          Show Advanced:
      </label>
      <br />
      <br />
      <label htmlFor="video-encoders">Video Encoder: </label>
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
      <br />
      <label>
        Bitrate:
        <input
          type="range"
          min="2500"
          max="100000"
          value={captureSettings?.videoEncoderSettings?.bitrate ?? 1}
          name="bitrate"
          step="10"
          title={`Bitrate: ${captureSettings?.videoEncoderSettings?.bitrate ?? 1} `}
          onChange={onVideoEncoderSettingChanged}
        />
      </label>
      <br />
      {/* <label>
        Max Bitrate:
        <input
          type="range"
          min="1"
          max="50000"
          value={captureSettings?.videoEncoderSettings?.max_bitrate ?? 1}
          name="max_bitrate"
          step="10"
          onChange={onVideoEncoderSettingChanged}
        />
      </label> */}
      {showAdvanced && <CaptureVideoEncoderAdvancedSettings />}
    </fieldset>
  );
};
export default CaptureVideoEncoderSettings;
