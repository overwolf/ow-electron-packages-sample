import React, { ChangeEvent, FC, useContext } from 'react';
import AppContext from '../../../context/app-context';
import {
  kNVENCEncoderRateControlArray,
  kNVENCEncoderTuningArray,
  kNVENCEncoderMultipassArray,
} from '../constants';
import { EncoderSettingsNVENCHEVC } from '@overwolf/ow-electron-packages-types';

const NVENCHEVCEncoderSettings: FC = () => {
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

  if (captureSettings?.videoEncoderSettings?.type !== 'jim_hevc_nvenc') {
    return <></>;
  }

  let vidEncSettings =
    captureSettings?.videoEncoderSettings as EncoderSettingsNVENCHEVC;

  return (
    <>
      <label>
        Enhancements:
        <input
          type="checkbox"
          checked={vidEncSettings.lookahead ?? false}
          name="lookahead"
          onChange={onVideoEncoderSettingChanged}
        />
      </label>

      <br />
      <label>
        cpq:
        <input
          type="text"
          value={vidEncSettings?.gpu ?? 0}
          name="ffmpeg_opts"
          onChange={onVideoEncoderSettingChanged}
        />
      </label>

      <br />
      <label htmlFor="video-encoder-preset">preset: </label>
      <select
        id="video-encoder-preset"
        value={vidEncSettings?.preset2 || ''}
        onChange={onVideoEncoderSettingChanged}
        name="preset2"
      >
        {['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7']?.map((preset) => (
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
        {kNVENCEncoderRateControlArray?.map((rate) => (
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
        {['main', 'main10']?.map((profile) => (
          <option key={profile} label={profile} value={profile} />
        ))}
      </select>
      <br />
      <label htmlFor="video-encoder-tune">Tune: </label>
      <select
        id="video-encoder-tune"
        value={vidEncSettings?.profile || 'main'}
        onChange={onVideoEncoderSettingChanged}
        name="tune"
      >
        {kNVENCEncoderTuningArray?.map((tune) => (
          <option key={tune} label={tune} value={tune} />
        ))}
      </select>
      <br />
      <label htmlFor="video-encoder-multipass">Multipass: </label>
      <select
        id="video-encoder-multipass"
        value={vidEncSettings?.multipass || 'disabled'}
        onChange={onVideoEncoderSettingChanged}
        name="multipass"
      >
        {kNVENCEncoderMultipassArray?.map((tune) => (
          <option key={tune} label={tune} value={tune} />
        ))}
      </select>
    </>
  );
};

export default NVENCHEVCEncoderSettings;
