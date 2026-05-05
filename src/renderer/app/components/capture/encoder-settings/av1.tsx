import React, { ChangeEvent } from 'react';
import react, { FC, useContext } from 'react';
import AppContext from '../../../context/app-context';
import {
  kAMDEncoderPresetAV1Array,
  kAMDEncoderRateControlArray,
} from '../constants';
import {
  EncoderSettingsAMFAV1,
} from '@overwolf/ow-electron-packages-types';
import AnyTypeInput from '../../app-settings/input-elements/any-type-input';

const AV1EncoderSettings: FC = () => {
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

  let supported_Encoders = ['ffmpeg_aom_av1','ffmpeg_svt_av1']

  if (!supported_Encoders.includes(captureSettings?.videoEncoderSettings?.type)) {
    return <></>;
  }

  let vidEncSettings =
    captureSettings?.videoEncoderSettings as EncoderSettingsAMFAV1;

  return (
    <>
      <div className='settings-input-item'>
        <AnyTypeInput 
          id='X246Options'
          labelText='X246 Options'
          value={vidEncSettings?.ffmpeg_opts ?? ''}
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
        <AnyTypeInput 
          id='video-encoder-cpq'
          labelText='cpq'
          value={vidEncSettings?.cpq || ''}
          onChange={onVideoEncoderSettingChanged}
          name="cpq"
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
      </div>

    </>
  );
};

export default AV1EncoderSettings;
