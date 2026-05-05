import React, { ChangeEvent, FC, useContext } from 'react';
import AppContext from '../../../context/app-context';
import {
  kAMDEncoderPresetAV1Array,
  kAMDEncoderRateControlArray,
} from '../constants';
import { EncoderSettingsAMFAV1 } from '@overwolf/ow-electron-packages-types';
import AnyTypeInput from '../../app-settings/input-elements/any-type-input';

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

  if (captureSettings?.videoEncoderSettings?.type !== 'obs_nvenc_h264_tex') {
    return <></>;
  }

  let vidEncSettings =
    captureSettings?.videoEncoderSettings as EncoderSettingsAMFAV1;

  return (
    <>
      <div className='settings-input-item'>
        <AnyTypeInput 
          id='ffmpegOptions'
          labelText='ffmpeg Options'
          value={vidEncSettings?.ffmpeg_opts ?? ''}
          name="ffmpeg_opts"
          onChange={onVideoEncoderSettingChanged}
        />
      </div>

      <div className='settings-input-item'>
        <AnyTypeInput 
          id='cpq'
          labelText='cpq'
          value={vidEncSettings?.cpq ?? 20}
          name="ffmpeg_opts"
          onChange={onVideoEncoderSettingChanged}
        />
      </div>

      <div className='settings-input-item'>
        <label htmlFor="video-encoder-preset">Preset</label>
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
      </div>

      <div className='settings-input-item'>
        <label htmlFor="video-encoder-rate_control">Rate control</label>
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
      </div>
 
      <div className='settings-input-item'>
        <label htmlFor="video-encoder-profile">Profile</label>
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
      </div>
      
    </>
  );
};

export default NVENCEncoderSettings;
