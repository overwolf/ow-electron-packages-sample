import React, { ChangeEvent, FC, useContext } from 'react';
import AppContext from '../../../context/app-context';
import {
  kNVENCEncoderRateControlArray,
  kNVENCEncoderTuningArray,
  kNVENCEncoderMultipassArray,
} from '../constants';
import { EncoderSettingsNVENC } from '@overwolf/ow-electron-packages-types';
import ToggleSwitch from '../../app-settings/input-elements/toggle-switch';
import AnyTypeInput from '../../app-settings/input-elements/any-type-input';

const NVENCAV1EncoderSettings: FC = () => {
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

  if (captureSettings?.videoEncoderSettings?.type !== 'obs_nvenc_av1_tex') {
    return <></>;
  }

  let vidEncSettings =
    captureSettings?.videoEncoderSettings as EncoderSettingsNVENC;

  return (
    <>
      <div className='settings-input-item'>
        <ToggleSwitch
          id="lookahead"
          labelText="Lookahead"
          checked={vidEncSettings?.lookahead ?? true}
          name="lookahead"
          onChange={onVideoEncoderSettingChanged}
        />
      </div>

      <div className='settings-input-item'>
        <ToggleSwitch
          id="psycho-aq"
          labelText="Psycho Visual Tuning"
          checked={vidEncSettings?.psycho_aq ?? false}
          name="psycho_aq"
          onChange={onVideoEncoderSettingChanged}
        />
      </div>

      <div className='settings-input-item'>
        <AnyTypeInput
          id='nvenc-av1-gpu'
          labelText='GPU'
          value={vidEncSettings?.gpu ?? 0}
          name="gpu"
          onChange={onVideoEncoderSettingChanged}
        />
      </div>

      <div className='settings-input-item'>
        <AnyTypeInput
          id='nvenc-av1-bframes'
          labelText='B-frames'
          value={vidEncSettings?.bf ?? 2}
          name="bf"
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
          {['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7']?.map((preset) => (
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
          {kNVENCEncoderRateControlArray?.map((rate) => (
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

      <div className='settings-input-item'>
        <label htmlFor="video-encoder-tune">Tune</label>
        <select
          id="video-encoder-tune"
          value={vidEncSettings?.tune || ''}
          onChange={onVideoEncoderSettingChanged}
          name="tune"
        >
          {kNVENCEncoderTuningArray?.map((tune) => (
            <option key={tune} label={tune} value={tune} />
          ))}
        </select>
      </div>

      <div className='settings-input-item'>
        <label htmlFor="video-encoder-multipass">Multipass</label>
        <select
          id="video-encoder-multipass"
          value={vidEncSettings?.multipass || 'disabled'}
          onChange={onVideoEncoderSettingChanged}
          name="multipass"
        >
          {kNVENCEncoderMultipassArray?.map((mode) => (
            <option key={mode} label={mode} value={mode} />
          ))}
        </select>
      </div>
    </>
  );
};

export default NVENCAV1EncoderSettings;
