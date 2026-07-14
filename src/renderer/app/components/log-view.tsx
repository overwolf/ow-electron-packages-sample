import React, { FC, useContext, useRef, useEffect, useState, useMemo } from 'react';
import AppContext from '../context/app-context';
import SectionHeader from './layout/section-header';
import JsonNode from './json-node';

const LogView: FC = () => {
  const { logMessages, clearMessages } = useContext(AppContext)?.logs;
  const [autoScroll, setAutoScroll] = useState(true);
  const [search, setSearch] = useState('');
  const logRef = useRef<HTMLDivElement>(null);

  const filteredMessages = useMemo(() => {
    if (!search.trim()) return logMessages ?? [];
    const lower = search.toLowerCase();
    return (logMessages ?? []).filter((entry) => {
      if (entry.message.toLowerCase().includes(lower)) return true;
      return entry.args?.some((arg) => {
        const str = typeof arg === 'object' && arg !== null
          ? JSON.stringify(arg)
          : String(arg);
        return str.toLowerCase().includes(lower);
      });
    });
  }, [logMessages, search]);

  useEffect(() => {
    if (autoScroll && !search && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logMessages, autoScroll, search]);

  return (
    <section className='logger-section'>
      <SectionHeader
        title='Logger'
        description='Track general application output and events'
      />

      <div className="page-inner">

        <div className="log-toolbar">
          <input
            className="log-search"
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <span className="log-search-count">
              {filteredMessages.length} / {logMessages?.length ?? 0}
            </span>
          )}
        </div>

        <div
          id="TerminalTextArea"
          className='log-terminal'
          ref={logRef}
        >
          {filteredMessages.map((entry, i) => (
            <div key={i} className={`log-entry ${entry.type}`}>
              <span>{entry.message}</span>
              {entry.args?.map((arg, j) => (
                <div key={j} className="log-entry-arg">
                  <JsonNode value={arg} />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="page-actions">
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
            Clear
          </button>
        </div>

      </div>

    </section>
  );
};

export default LogView;
