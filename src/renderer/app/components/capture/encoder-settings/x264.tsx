import React, { ChangeEvent, FC, useContext } from 'react';
import AppContext from '../../../context/app-context';
import {
  kX264EncoderPresetArray,
  kX264EncoderTuneArray,
  kX264EncoderProfileArray,
} from '../constants';
import { EncoderSettingsX264 } from '@overwolf/ow-electron-packages-types';

const X264EncoderSettings: FC = () => {
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

  if (captureSettings?.videoEncoderSettings?.type !== 'obs_x264') {
    return <></>;
  }

  let vidEncSettings =
    captureSettings?.videoEncoderSettings as EncoderSettingsX264;

  return (
    <>
      <label>
        X246 Options:
        <input
          type="text"
          value={vidEncSettings?.x264opts ?? ''}
          name="x264opts"
          onChange={onVideoEncoderSettingChanged}
        />
      </label>
      <br />
      <label>
        use Buffer size:
        <input
          type="checkbox"
          checked={vidEncSettings?.use_bufsize ?? false}
          name="use_bufsize"
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
        {kX264EncoderPresetArray?.map((preset) => (
          <option key={preset} label={preset} value={preset} />
        ))}
      </select>
      <br />
      <label htmlFor="video-encoder-tune">Tune: </label>
      <select
        id="video-encoder-tune"
        value={vidEncSettings?.tune || ''}
        onChange={onVideoEncoderSettingChanged}
        name="tune"
      >
        {kX264EncoderTuneArray?.map((tune) => (
          <option key={tune} label={tune} value={tune} />
        ))}
      </select>
      <br />
      <label htmlFor="video-encoder-profile">Profile: </label>
      <select
        id="video-encoder-profile"
        value={vidEncSettings?.profile || ''}
        onChange={onVideoEncoderSettingChanged}
        name="profile"
      >
        {kX264EncoderProfileArray?.map((profile) => (
          <option key={profile} label={profile} value={profile} />
        ))}
      </select>
    </>
  );

};

export default X264EncoderSettings;
