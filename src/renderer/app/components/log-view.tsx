import React, { FC, useContext } from 'react';
import AppContext from '../context/app-context';

const LogView: FC = () => {
  const { logMessages, clearMessages } = useContext(AppContext)?.logs;

  return (
    <>
      <h2>Log:</h2>
      <div className="row">
        <div className="span12">
          <textarea
            id="TerminalTextArea"
            style={{ border: '1px solid gray', width: '100%', height: '200px' }}
            value={logMessages.join('\r')}
            readOnly
          />
          <span className="span1">
            <button
              onClick={clearMessages}
              style={{ marginTop: '10px' }}
              id="clearTerminalTextAreaBtn"
              className="btn"
            >
              Clean
            </button>
          </span>
        </div>
      </div>
    </>
  );
};

export default LogView;
