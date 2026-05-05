import React, { ChangeEvent, FC, useContext } from 'react';
import AppContext from '../../context/app-context';
import {
  AudioDeviceSettingsInfo,
  AudioDeviceType,
} from '@overwolf/ow-electron-packages-types';
import ToggleSwitch from '../app-settings/input-elements/toggle-switch';

const AudioDevices: FC = () => {
  const {
    recordingInfo,
    captureSettingsOptions,
    selectedInputDevice,
    selectedOutputDevice,
    setSelectedInputDevice,
    setSelectedOutputDevice,
    setCaptureSettingsOptions,
  } = useContext(AppContext)?.recording;

  //----------------------------------------------------------------------------
  const handleOnInputChange = (
    e: ChangeEvent<HTMLSelectElement>,
    type: AudioDeviceType,
  ) => {
    let ids: string[] = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );

    let audioDevices: AudioDeviceSettingsInfo[] = [];
    for (const id of ids) {
      const device = recordingInfo?.audio?.inputDevices.find((i) => i.id == id);
      if (!device) {
        continue;
      }

      // If the device is 'Default', we rename it to 'Mic' to match recorder
      // package expectations about default input device.
      let deviceName = device.name;
      if (deviceName === 'Default') {
        deviceName = 'Mic';
      }

      audioDevices.push({
        id,
        name: deviceName,
        type,
      });
    }

    setSelectedInputDevice?.(audioDevices[0]);
  };
  //----------------------------------------------------------------------------
  const handleOutputChange = (
    e: ChangeEvent<HTMLSelectElement>,
    type: AudioDeviceType,
  ) => {
    let ids: string[] = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );

    let audioDevices: AudioDeviceSettingsInfo[] = [];
    for (const id of ids) {
      const device = recordingInfo?.audio?.outputDevices.find(
        (i) => i.id == id,
      );

      if (!device) {
        continue;
      }

      // If the device is 'Default', we rename it to 'Desktop' to match recorder
      // package expectations about default output device.
      let deviceName = device.name;
      if (deviceName === 'Default') {
        deviceName = 'Desktop';
      }

      audioDevices.push({
        id,
        name: deviceName,
        type,
      });
    }

    setSelectedOutputDevice?.(audioDevices[0]);
  };

  const useDefaultAudioDevices =
    captureSettingsOptions?.includeDefaultAudioSources ?? true;

  const handleDefaultAudioDevicesToggle = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = e.target.checked;
    setCaptureSettingsOptions?.({
      ...captureSettingsOptions,
      includeDefaultAudioSources: checked,
    });
  };

  return (
    <>
      <h4 className="settings-sub-title">Audio devices</h4>

      <div className="settings-input-item">
        <ToggleSwitch
          id="useDefaultAudioDevices"
          labelText="Use default audio devices"
          checked={useDefaultAudioDevices}
          onChange={handleDefaultAudioDevicesToggle}
        />
      </div>

      <div className="settings-input-item">
        <label htmlFor="audioDevices">Input device</label>
        <select
          id="audioDevices"
          value={selectedInputDevice?.id || ''}
          onChange={(e) => handleOnInputChange(e, 'input')}
          disabled={useDefaultAudioDevices}
          className={useDefaultAudioDevices ? 'is-disabled' : ''}
          style={
            useDefaultAudioDevices
              ? {
                  opacity: 0.4,
                  cursor: 'not-allowed',
                }
              : undefined
          }
        >
          {recordingInfo?.audio?.inputDevices?.map((input) => {
            return (
              <option value={input.id} key={input.id}>
                {input?.name}
              </option>
            );
          })}
        </select>
      </div>

      <div className="settings-input-item">
        <label htmlFor="outputDevice">Output device</label>
        <select
          onChange={(e) => handleOutputChange(e, 'output')}
          value={selectedOutputDevice?.id || ''}
          id="outputDevice"
          disabled={useDefaultAudioDevices}
          className={useDefaultAudioDevices ? 'is-disabled' : ''}
          style={
            useDefaultAudioDevices
              ? {
                  opacity: 0.4,
                  cursor: 'not-allowed',
                }
              : undefined
          }
        >
          {recordingInfo?.audio?.outputDevices?.map((output) => {
            return (
              <option value={output.id} key={output.id}>
                {output?.name}
              </option>
            );
          })}
        </select>
      </div>
    </>
  );
};

export default AudioDevices;
