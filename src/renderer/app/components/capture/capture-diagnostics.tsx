import React, { FC, useContext } from 'react';
import { RecordingActions } from '../../api-actions/recording-actions';
import AppContext from '../../context/app-context';

// -----------------------------------------------------------------------------
const CaptureDiagnostics: FC = () => {
  const { newLogMessage } = useContext(AppContext)?.logs ?? {};

  const handleQueryInfo = async (overrideCache: boolean) => {
    const info = await RecordingActions.queryInfo(overrideCache);
    newLogMessage?.('queryInformation', 'info', [info]);
  }

  return (
    <div className='capture-actions'>
      <div className='capture-actions-group'>
        <button className='btn-secondary' onClick={() => handleQueryInfo(false)} id="query-info-button">
          Query Info
        </button>
        <button className='btn-secondary' onClick={() => handleQueryInfo(true)} id="query-info-override-cache-button">
          Query Info (override cache)
        </button>
      </div>
    </div>
  );
};
export default CaptureDiagnostics;
