import React, { FC } from 'react';

// -----------------------------------------------------------------------------
const AdView: FC = () => {
  return (
    <div className="left-view">
      <h2>Ad View:</h2>
      <div
        style={{
          width: '400px',
          height: '300px',
          border: '1px solid',
          background: 'transparent',
        }}
      >
        <owadview slotsize="400x300" cid="mainAd" />
      </div>
    </div>
  );
};

export default AdView;
