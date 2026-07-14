import { useState } from 'react';

export type LogType = 'info' | 'warn' | 'success' | 'error' | 'result' | 'dim';

export interface LogEntry {
  message: string;
  type: LogType;
  args?: any[];
}

export function useLogs() {
  const [logMessages, setLogMessages] = useState<LogEntry[]>([]);

  const newLogMessage = (message: string, type: LogType = 'info', args?: any[]) => {
    setLogMessages((prev) => {
      console.log('message', message);
      return [...prev, { message, type, args }];
    });
  };

  const clearMessages = () => setLogMessages([]);

  return {
    logMessages,
    newLogMessage,
    clearMessages,
  };
}
