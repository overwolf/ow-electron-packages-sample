import React, { FC } from 'react';
import AdView from './ad-view';
import InputEXclusive from './input-exclusive';

const ViewsWrapper: FC = () => {
  return (
    <div className="views" style={{ display: 'flex', gap: '24px' }}>
      <AdView />
      <InputEXclusive />
    </div>
  );
};

export default ViewsWrapper;
