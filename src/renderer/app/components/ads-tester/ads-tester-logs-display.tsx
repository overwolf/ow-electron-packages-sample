import React, { FC, useEffect, useRef, useState } from 'react';

const AdsTesterLogsDisplay: FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const originalConsoleLog = useRef<(...args: any[]) => void>();

  useEffect(() => {

    originalConsoleLog.current = console.log;

    console.log = (...args: any[]) => {

      originalConsoleLog.current?.apply(console, args);

      const logMessage = args.map(arg => {
        try {
          return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
        } catch {
          return String(arg);
        }
      }).join(' ');

    
      setLogs(prevLogs => [...prevLogs, logMessage]);
    };

    return () => {
      if (originalConsoleLog.current) {
        console.log = originalConsoleLog.current;
      }
    };
  }, []);

  return (
    <textarea
      className='tester-logs-display'
      value={logs.join('\n')}
      readOnly
    />
  );
};

export default AdsTesterLogsDisplay;