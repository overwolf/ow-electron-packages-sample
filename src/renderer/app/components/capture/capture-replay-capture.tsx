import React, { ChangeEvent, FC, useContext, useState } from 'react';
import AppContext from '../../context/app-context';
import NumberInput from '../app-settings/input-elements/number-input';

// -----------------------------------------------------------------------------
const CaptureReplayCapture: FC = () => {
  const { replayCaptureOptions, setReplayCaptureOptions } =
    useContext(AppContext).recording;

  return (
    <>
      <div className='settings-input-item'>
        <NumberInput
          labelText={'Past time duration (ms)'}
          id={'pastTimeMs'}
          value={replayCaptureOptions?.pastDuration ?? 0}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            let value: number = parseInt(e.target.value) ? parseInt(e.target.value) : 0 ;

            setReplayCaptureOptions({
              ...replayCaptureOptions,
              pastDuration: value ?? 0,
            });
          }}
        />
      </div>

      <div className='settings-input-item'>
        <NumberInput
          labelText={'Timeout(ms)'}
          id={'timeoutMs'}
          value={replayCaptureOptions?.timeout}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            let value: number = parseInt(e.target.value) ? parseInt(e.target.value) : 0 ;
            setReplayCaptureOptions({
              ...replayCaptureOptions,
              timeout: value ?? 10000,
            });
          }}
        />
      </div>
    </>
  );
};
export default CaptureReplayCapture;
