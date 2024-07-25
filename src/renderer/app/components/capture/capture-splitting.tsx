import React, { ChangeEvent, FC, useContext } from 'react';
import AppContext from '../../context/app-context';

// -----------------------------------------------------------------------------
const CaptureSplitting: FC = () => {
  const { recordingOptions, setRecordingOptions } =
    useContext(AppContext)?.recording;

  return (
    <fieldset>
      <legend>Splitting:</legend>
      <label>
        <input
          type="checkbox"
          checked={recordingOptions?.split?.enableManual}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            let checked = e.target.checked;
            let split = checked
              ? { ...recordingOptions.split, enableManual: e.target.checked }
              : undefined;
            setRecordingOptions({ ...recordingOptions, split });
          }}
        />
        Enable Splitting
      </label>
      <br />
      {recordingOptions?.split?.enableManual && (
        <>
          <label>
            Max Split time (sec)
            <input
              type="text"
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
          </label>
          <br />
          <label>
            Max Split size (MB)
            <input
              type="text"
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
          </label>
        </>
      )}
    </fieldset>
  );
};
export default CaptureSplitting;
