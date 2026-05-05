import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ipcRenderer } from 'electron';

type GepLogsContextValue = {
  logs: string[];
  addLog: (message: string) => void;
  clearLogs: () => void;
};

const GepLogsContext = createContext<GepLogsContextValue>(null);

export const GepLogsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = useCallback((message: string) => {
    const separator = '-----------------------------------';
    setLogs(prev => [...prev, separator, message]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  useEffect(() => {
    const onGepInfo = (_event: any, payload: { gameId: number; data: any }) => {
      try {
        addLog(`[gep-game-info]: ${JSON.stringify(payload?.data)}`);
      } catch {
        addLog(`[gep-game-info]: ${String(payload)}`);
      }
    };

    const onGepEvent = (_event: any, payload: { gameId: number; data: any }) => {
      try {
        addLog(`[gep-game-event]: ${JSON.stringify(payload?.data)}`);
      } catch {
        addLog(`[gep-game-event]: ${String(payload)}`);
      }
    };

    ipcRenderer.on('gep-info', onGepInfo);
    ipcRenderer.on('gep-event', onGepEvent);

    return () => {
      ipcRenderer.removeListener('gep-info', onGepInfo);
      ipcRenderer.removeListener('gep-event', onGepEvent);
    };
  }, [addLog]);

  const value = useMemo(() => ({ logs, addLog, clearLogs }), [logs, addLog, clearLogs]);

  return (
    <GepLogsContext.Provider value={value}>{children}</GepLogsContext.Provider>
  );
};

export const useGepLogs = () => useContext(GepLogsContext);



