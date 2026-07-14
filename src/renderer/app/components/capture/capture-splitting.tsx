import React, { ChangeEvent, FC, useContext } from 'react';
import AppContext from '../../context/app-context';
import ToggleSwitch from '../app-settings/input-elements/toggle-switch';
import NumberInput from '../app-settings/input-elements/number-input';

// -----------------------------------------------------------------------------
const CaptureSplitting: FC = () => {
  const { recordingOptions, setRecordingOptions } =
    useContext(AppContext)?.recording;

  return (
    <>
      <div className='settings-input-item'>
        <ToggleSwitch
          id="enableSplitting"
          labelText="Enable Splitting"
          checked={recordingOptions?.split?.enableManual ?? false}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            let checked = e.target.checked;
            let split = checked
              ? { ...recordingOptions.split, enableManual: e.target.checked }
              : undefined;
            setRecordingOptions({ ...recordingOptions, split });
          }}
        />
      </div>

      {recordingOptions?.split?.enableManual && (
        <>
          <div className='settings-input-item'>
            <NumberInput 
              id='maxSplitTime'
              labelText='Max split time (sec)'
              value={recordingOptions?.split?.maxTimeSecond ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                let value: number = parseInt(e.target.value)
                  ? parseInt(e.target.value)
                  : 0;
                let split = {
                  ...recordingOptions.split,
                  maxTimeSecond: value,
                };
                setRecordingOptions({ ...recordingOptions, split });
              }}
            />
          </div>

          <div className='settings-input-item'>
            <NumberInput 
              id='maxSplitSize'
              labelText='Max Split size (MB)'
              value={recordingOptions?.split?.maxBySizeMB ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                let value: number = parseInt(e.target.value)
                  ? parseInt(e.target.value)
                  : 0;
                let split = {
                  ...recordingOptions.split,
                  maxBySizeMB: value,
                };
                setRecordingOptions({ ...recordingOptions, split });
              }}
            />
          </div>
        </>
      )}
    </>
  );
};
export default CaptureSplitting;
