import React, { ChangeEvent, FC, useContext } from 'react';
import AppContext from '../../../context/app-context';
import { kQuickSyncTargetUsageArray } from '../constants';
import { EncoderSettingsQuickSyncHEVC } from '@overwolf/ow-electron-packages-types';
import AnyTypeInput from '../../app-settings/input-elements/any-type-input';
import ToggleSwitch from '../../app-settings/input-elements/toggle-switch';

const QsHevcEncoderSettings: FC = () => {
  const { captureSettings, setCaptureSettings } =
    useContext(AppContext)?.recording;

  const onVideoEncoderSettingChanged = (e: ChangeEvent) => {
    let { value, name, checked, type } = e.target as any;
    let videoEncoderSettings = {
      ...captureSettings.videoEncoderSettings,
      [name]: type === 'checkbox' ? checked : value,
    };
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
      <div className='settings-input-item'>
        <AnyTypeInput 
          id='bframes'
          labelText='bframes'
          value={vidEncSettings?.bframes ?? ''}
          name="bframes"
          onChange={onVideoEncoderSettingChanged}
        />
      </div>

      <div className='settings-input-item'>
        <ToggleSwitch
          id="enhancements"
          labelText="Enhancements"
          checked={vidEncSettings?.enhancements ?? false}
          name="enhancements"
          onChange={onVideoEncoderSettingChanged}
        />
      </div>

      <div className='settings-input-item'>
        <label htmlFor="video-encoder-profile">Profile</label>
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
      </div>

      <div className='settings-input-item'>
        <label htmlFor="video-encoder-target-usage">Target Usage</label>
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
      </div>
    </>
  );
};

export default QsHevcEncoderSettings;
