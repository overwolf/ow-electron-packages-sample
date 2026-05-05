import React, { FC, useContext, useRef, useEffect, useState } from 'react';
import AppContext from '../context/app-context';
import SectionHeader from './layout/section-header';

const LogView: FC = () => {
  const { logMessages, clearMessages } = useContext(AppContext)?.logs;
  const [autoScroll, setAutoScroll] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoScroll && textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [logMessages, autoScroll]);

  return (
    <section className='logger-section'>
      <SectionHeader
        title='Logger'
        description='Track general application output and events'
      />

      <div className="page-inner">

        <textarea
          id="TerminalTextArea"
          className='log-terminal'
          value={logMessages.join('\r')}
          readOnly
          ref={textareaRef}
        />

        <div className="page-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={e => setAutoScroll(e.target.checked)}
              id="autoScrollCheckbox"
            />
            Auto scroll
          </label>
          <button
            onClick={clearMessages}
            id="clearTerminalTextAreaBtn"
            className="btn-secondary"
          >
            Clean
          </button>
        </div>

      </div>

    </section>
  );
};

export default LogView;
