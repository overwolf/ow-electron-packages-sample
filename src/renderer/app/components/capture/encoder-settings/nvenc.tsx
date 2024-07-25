import React, { ChangeEvent, FC, useContext } from 'react';
import AppContext from '../../../context/app-context';
import {
  kAMDEncoderPresetAV1Array,
  kAMDEncoderRateControlArray,
} from '../constants';
import { EncoderSettingsAMFAV1 } from '@overwolf/ow-electron-packages-types';

const NVENCEncoderSettings: FC = () => {
  const { captureSettings, setCaptureSettings } =
    useContext(AppContext)?.recording;

  const onVideoEncoderSettingChanged = (e: ChangeEvent) => {
    let { value, name, checked } = e.target as any;
    let videoEncoderSettings = captureSettings.videoEncoderSettings;
    videoEncoderSettings[name] = checked ? checked : value;
    setCaptureSettings({
      ...captureSettings,
      videoEncoderSettings,
    });

    setCaptureSettings({ ...captureSettings, videoEncoderSettings });
  };

  if (captureSettings?.videoEncoderSettings?.type !== 'jim_nvenc') {
    return <></>;
  }

  let vidEncSettings =
    captureSettings?.videoEncoderSettings as EncoderSettingsAMFAV1;

  return (
    <>
      <label>
        ffmpeg Options:
        <input
          type="text"
          value={vidEncSettings?.ffmpeg_opts ?? ''}
          name="ffmpeg_opts"
          onChange={onVideoEncoderSettingChanged}
        />
      </label>

      <br />
      <label>
        cpq:
        <input
          type="text"
          value={vidEncSettings?.cpq ?? 20}
          name="ffmpeg_opts"
          onChange={onVideoEncoderSettingChanged}
        />
      </label>

      <br />
      <label htmlFor="video-encoder-preset">preset: </label>
      <select
        id="video-encoder-preset"
        value={vidEncSettings?.preset || ''}
        onChange={onVideoEncoderSettingChanged}
        name="preset"
      >
        {kAMDEncoderPresetAV1Array?.map((preset) => (
          <option key={preset} label={preset} value={preset} />
        ))}
      </select>
      <br />
      <label htmlFor="video-encoder-rate_control">Rate Control: </label>
      <select
        id="video-encoder-rate_control"
        value={vidEncSettings?.rate_control || ''}
        onChange={onVideoEncoderSettingChanged}
        name="rate_control"
      >
        {kAMDEncoderRateControlArray?.map((rate) => (
          <option key={rate} label={rate} value={rate} />
        ))}
      </select>
      <br />
      <label htmlFor="video-encoder-profile">Profile: </label>
      <select
        id="video-encoder-profile"
        value={vidEncSettings?.profile || 'main'}
        onChange={onVideoEncoderSettingChanged}
        name="profile"
      >
        {['main']?.map((profile) => (
          <option key={profile} label={profile} value={profile} />
        ))}
      </select>
    </>
  );
};

export default NVENCEncoderSettings;
