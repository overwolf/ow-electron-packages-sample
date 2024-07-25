import React, { ChangeEvent, FC, useContext } from 'react';
import AppContext from '../../../context/app-context';
import { kQuickSyncTargetUsageArray } from '../constants';
import { EncoderSettingsQuickSyncHEVC } from '@overwolf/ow-electron-packages-types';

const QsHevcEncoderSettings: FC = () => {
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
  let supported_Encoders = ['obs_qsv11_hevc', 'obs_qsv11_v2'];

  if (
    !supported_Encoders.includes(captureSettings?.videoEncoderSettings?.type)
  ) {
    return <></>;
  }

  let vidEncSettings =
    captureSettings?.videoEncoderSettings as EncoderSettingsQuickSyncHEVC;
  vidEncSettings.target_usage;

  return (
    <>
      <label>
        bframes:
        <input
          type="text"
          value={vidEncSettings?.bframes ?? ''}
          name="bframes"
          onChange={onVideoEncoderSettingChanged}
        />
      </label>
      <br />
      <label>
        Enhancements:
        <input
          type="checkbox"
          checked={vidEncSettings?.enhancements ?? false}
          name="enhancements"
          onChange={onVideoEncoderSettingChanged}
        />
      </label>

      <label htmlFor="video-encoder-profile">Profile: </label>
      <select
        id="video-encoder-profile"
        value={vidEncSettings?.profile || ''}
        onChange={onVideoEncoderSettingChanged}
        name="profile"
      >
        {['main']?.map((profile) => (
          <option key={profile} label={profile} value={profile} />
        ))}
      </select>
      <br />
      <label htmlFor="video-encoder-target-usage">Target Usage: </label>
      <select
        id="video-encoder-target-usage"
        value={vidEncSettings?.target_usage ?? ''}
        onChange={onVideoEncoderSettingChanged}
        name="target_usage"
      >
        {kQuickSyncTargetUsageArray?.map((usage) => (
          <option key={usage} label={usage} value={usage} />
        ))}
      </select>
    </>
  );
};

export default QsHevcEncoderSettings;
