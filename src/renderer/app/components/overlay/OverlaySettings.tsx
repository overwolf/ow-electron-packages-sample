import React, { FC } from 'react';
import InputExclusive from './input-exclusive';
import HighElevationHelper from './high-elevation-helper';

// -----------------------------------------------------------------------------
const OverlaySettings: FC = () => {
  return (
    <section className='overlay-settings'>
      <HighElevationHelper />
      <InputExclusive />
    </section>
  );
};

export default OverlaySettings;
