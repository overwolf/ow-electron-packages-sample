import React, { ChangeEvent, FC, useContext, useState } from 'react';
import AppContext from '../../context/app-context';

// -----------------------------------------------------------------------------
const CaptureReplay: FC = () => {
  const { replayOptions, setReplayOptions } = useContext(AppContext).recording;
  return (
    <fieldset>
      <legend>Replay Options:</legend>
      <label>
        Buffer (sec)
        <input
          type="text"
          value={replayOptions?.bufferSecond ?? 30000}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            let value: number =
              parseInt(e.target.value) ? parseInt(e.target.value) : 0 ;
            setReplayOptions({
              ...replayOptions,
              bufferSecond: value,
            });
          }}
        />
      </label>
    </fieldset>
  );
};
export default CaptureReplay;
