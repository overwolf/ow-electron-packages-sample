import { useState } from 'react';

export function useLogs() {
  const [logMessages, setLogMessages] = useState<string[]>([]);

  const newLogMessage = (message: string) => {
    setLogMessages((prev) => {
      const separator =
        '-------------------------------------------------------';
      console.log('message', message);
      return [...prev, separator, message];
    });
  };

  const clearMessages = () => setLogMessages([]);

  return {
    logMessages,
    newLogMessage,
    clearMessages,
  };
}
