import React, { ChangeEvent, FC, useContext, useState } from 'react';
import AppContext from '../../context/app-context';

// -----------------------------------------------------------------------------
const CaptureReplayCapture: FC = () => {
  const { replayCaptureOptions, setReplayCaptureOptions } =
    useContext(AppContext).recording;

  return (
    <fieldset>
      <legend>Replay Capture:</legend>
      <label>
        Past Time duration (ms)
        <input
          type="text"
          value={replayCaptureOptions?.pastDuration ?? 0}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            let value: number = parseInt(e.target.value) ? parseInt(e.target.value) : 0 ;

            setReplayCaptureOptions({
              ...replayCaptureOptions,
              pastDuration: value ?? 0,
            });
          }}
        />
      </label>
      <br />
      <label>
        Timeout(ms)
        <input
          type="text"
          value={replayCaptureOptions?.timeout}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            let value: number = parseInt(e.target.value) ? parseInt(e.target.value) : 0 ;
            setReplayCaptureOptions({
              ...replayCaptureOptions,
              timeout: value ?? 10000,
            });
          }}
        />
      </label>
    </fieldset>
  );
};
export default CaptureReplayCapture;
