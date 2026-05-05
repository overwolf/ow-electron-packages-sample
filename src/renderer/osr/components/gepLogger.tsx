import React, { FC, useEffect, useRef, useState } from 'react';
import { useGepLogs } from '../../app/context/gep-logs-context';

const GEPLogsDisplay: FC = () => {
  const { logs, clearLogs } = useGepLogs();
  const [autoScroll, setAutoScroll] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoScroll && textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // Note: data population comes from GepLogsProvider; this component only renders

  return (
    <section className="gep-logs-display-section">
      <h2 className="overlay-window-title">GEP logger</h2>
      <textarea
        className="gep-logs-display"
        value={logs.join('\n')}
        readOnly
        ref={textareaRef}
      />
      <div
        className="page-actions"
        style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
      >
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
          />
          Auto scroll
        </label>
        <button onClick={clearLogs} className="btn-secondary">
          Clean
        </button>
      </div>
      <hr />
    </section>
  );
};

export default GEPLogsDisplay;
