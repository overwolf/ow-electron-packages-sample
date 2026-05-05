import React, { ChangeEvent, FC, useContext } from 'react';
import { kKnownAudioEncodersTypes } from '@overwolf/ow-electron-packages-types';
import AppContext from '../../context/app-context';
import { audioSampleRate } from './constants';
import AudioTracksSelection from './audio-tracks';
import AudioDevices from './audio-devices';
import ToggleSwitch from '../app-settings/input-elements/toggle-switch';

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

    if (name === 'lowLatencyAudioBuffering') {
      audioSettings[name] = checked;
      setCaptureSettings({
        ...captureSettings,
        audioSettings,
      });
      return;
    }

    if (name === 'sampleRate') {
      value = parseInt(value);
      if (isNaN(value)) {
        console.error(`Invalid sample rate: ${value}`);
        return;
      }
      audioSettings[name] = value;
      setCaptureSettings({
        ...captureSettings,
        audioSettings,
      });
    }
  };

  return (
    <>
      <div className="settings-input-item">
        <ToggleSwitch
          id="lowLatencyAudioBuffering"
          labelText="Low latency audio buffering"
          checked={
            captureSettings?.audioSettings?.lowLatencyAudioBuffering === true ??
            false
          }
          name="lowLatencyAudioBuffering"
          onChange={onAudioSettingChanged}
        />
      </div>

      <div className="settings-input-item">
        <ToggleSwitch
          id="separateAudioTracks"
          labelText="Separate audio tracks"
          checked={
            captureSettingsOptions?.separateAudioTracks === true ?? false
          }
          name="separateAudioTracks"
          onChange={onSeparateAudioTracksChanged}
        />
      </div>

      <div className="settings-input-item">
        <label htmlFor="audio-sample_rate">Sample Rate</label>
        <select
          id="audio-sample_rate"
          value={captureSettings?.audioSettings?.sampleRate ?? 48000}
          onChange={onAudioSettingChanged}
          name="sampleRate"
        >
          {audioSampleRate.map((sample) => (
            <option key={sample} label={`${sample}`} value={sample} />
          ))}
        </select>
      </div>

      <AudioDevices />

      {/* 
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
      */}
    </>
  );
};
export default CaptureAudio;
