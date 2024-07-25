import React, { ChangeEvent, FC, useContext } from 'react';
import {
  kKnownAudioEncodersTypes,
} from '@overwolf/ow-electron-packages-types';
import AppContext from '../../context/app-context';
import { audioSampleRate } from './constants';
import AudioTracksSelection from './audio-tracks';
import AudioDevices from './audio-devices';

const CaptureAudio: FC = () => {
  const {
    captureSettingsOptions,
    setCaptureSettingsOptions,
    setCaptureSettings,
    captureSettings,
  } = useContext(AppContext)?.recording;

  const onAudioEncoderChanged = (e: ChangeEvent<HTMLSelectElement>) => {
    let value = e.target.value as kKnownAudioEncodersTypes;
    setCaptureSettingsOptions({
      ...captureSettingsOptions,
      audioEncoder: value,
    });
  };

  const onSeparateAudioTracksChanged = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.checked;
    setCaptureSettingsOptions({
      ...captureSettingsOptions,
      separateAudioTracks: value,
    });
  };

  const onAudioSettingChanged = (e: ChangeEvent) => {
    let { value, name, checked } = e.target as any;

    let audioSettings = captureSettings?.audioSettings;
    audioSettings[name] = checked ? checked : parseInt(value);
    setCaptureSettings({
      ...captureSettings,
      audioSettings,
    });
  };

  return (
    <fieldset>
      <legend>Audio:</legend>
      <label>
        <input
          type="checkbox"
          checked={
            captureSettings?.audioSettings?.lowLatencyAudioBuffering === true ??
            false
          }
          step="10"
          name="lowLatencyAudioBuffering"
          onChange={onAudioSettingChanged}
        />
        low Latency Audio Buffering:
      </label>
      <br />
      <label>
        <input
          type="checkbox"
          checked={
            captureSettingsOptions?.separateAudioTracks === true ?? false
          }
          name="separateAudioTracks"
          onChange={onSeparateAudioTracksChanged}
        />
        Separate Audio tracks:
      </label>
      <br />
      <label>
        Sample Rate:
        <select
          id="audio-sample_rate"
          value={captureSettings?.audioSettings?.sampleRate ?? 44100}
          onChange={onAudioSettingChanged}
          name="sampleRate"
        >
          {audioSampleRate.map((sample) => (
            <option key={sample} label={`${sample}`} value={sample} />
          ))}
        </select>
      </label>
      <br />
      {/* <label>
        Audio Tracks:
        <AudioTracksSelection />
      </label> */}
      <br />

      <label>
        <AudioDevices />
      </label>
      <br />

      {/* <fieldset>
        <legend>Encoder Settings:</legend>
        <label htmlFor="audio-encoders">Audio Encoder: </label>
        <select
          id="audio-encoders"
          value={captureSettingsOptions?.audioEncoder ?? ''}
          onChange={onAudioEncoderChanged}
          name="audioEncoder"
        >
          {recordingInfo?.audio?.encoders?.map((encoder) => (
            <option
              key={encoder.name}
              label={encoder.name}
              value={encoder.type}
            />
          ))}
        </select>
        <br />
      </fieldset> */}
    </fieldset>
  );
};
export default CaptureAudio;
