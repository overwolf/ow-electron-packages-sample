import React, { ChangeEvent, FC, useContext, useEffect, useState } from 'react';
import AppContext from '../../context/app-context';
import {
  AudioDeviceSettingsInfo,
  AudioDeviceType,
} from '@overwolf/ow-electron-packages-types';
import { RecordingActions } from '../../api-actions/recording-actions';

const AudioDevices: FC = () => {
  const { recordingInfo, captureSettings } = useContext(AppContext)?.recording;

  const [selectedDevices, setSelectedDevices] = useState<
    AudioDeviceSettingsInfo[]
  >([]);

  // Note - Since all audio devices are returned as "input" devices after adding them.
  // we need to filter the input and output devices based on their id's.
  const outputDeviceIds = recordingInfo?.audio?.outputDevices.map((d) => d.id);
  const selectedInputNames =
    captureSettings?.audioSettings?.inputs
      .filter((d) => !outputDeviceIds?.includes(d.id))
      .map((i) => i.id) ?? [];

  const selectedOutputNames =
    captureSettings?.audioSettings?.outputs
      .filter((d) => outputDeviceIds?.includes(d.id))
      .map((o) => o.id) ?? [];

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

      audioDevices.push({
        id,
        name: device.name,
        type,
      });
    }

    const selectedOutput = selectedDevices.filter((d) => d.type === 'output');
    setSelectedDevices([...selectedOutput, ...audioDevices]);
  };

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

      audioDevices.push({
        id,
        name: device.name,
        type,
      });
    }

    const selectedInputs = selectedDevices.filter((d) => d.type === 'input');
    setSelectedDevices([...selectedInputs, ...audioDevices]);
  };

  useEffect(() => {
    if (selectedDevices.length === 0) {
      return;
    }

    RecordingActions.setAudioDevice(selectedDevices);
  }, [selectedDevices]);

  return (
    <fieldset>
      <legend>Audio Devices:</legend>
      <fieldset>
        <legend>Input:</legend>
        <label>
          <select multiple onChange={(e) => handleOnInputChange(e, 'input')}>
            {recordingInfo?.audio?.inputDevices?.map((input) => {
              return (
                <option
                  value={input.id}
                  key={input.id}
                  style={{
                    backgroundColor: selectedInputNames?.includes(input.id)
                      ? 'lightcyan'
                      : 'white',
                  }}
                >
                  {input?.name}
                </option>
              );
            })}
          </select>
        </label>
      </fieldset>
      <fieldset>
        <legend>Output:</legend>
        <label>
          <select multiple onChange={(e) => handleOutputChange(e, 'output')}>
            {recordingInfo?.audio?.outputDevices?.map((output) => {
              return (
                <option
                  value={output.id}
                  key={output.id}
                  style={{
                    backgroundColor: selectedOutputNames?.includes(output.id)
                      ? 'lightcyan'
                      : 'white',
                  }}
                >
                  {output?.name}
                </option>
              );
            })}
          </select>
        </label>
      </fieldset>
    </fieldset>
  );
};

export default AudioDevices;
