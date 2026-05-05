import React, { ChangeEvent, FC, useContext } from 'react';
import AppContext from '../../context/app-context';
import NumberInput from '../app-settings/input-elements/number-input';

// -----------------------------------------------------------------------------
const CaptureReplay: FC = () => {
  const { replayOptions, setReplayOptions } = useContext(AppContext).recording;
  return (
    <div className='settings-input-item'>
      <NumberInput
        labelText={'Buffer (sec)'}
        id={'bufferSec'}
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
    </div>
  );
};
export default CaptureReplay;
