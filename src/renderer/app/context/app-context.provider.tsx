import React, { FC, ReactNode } from 'react';
import AppContext from './app-context';
import { useLogs } from '../hooks/useLogs';
import { useRecording } from '../hooks/useRecording';
import { useOverlaySettings } from '../hooks/useOverlaySettings';
import { usePackages } from '../hooks/usePackages';
interface Props {
  children: ReactNode;
}

const AppContextProvider: FC<Props> = ({ children }) => {
  const logs = useLogs();
  const recording = useRecording(logs.newLogMessage);
  const overlaySettings = useOverlaySettings();
  const availablePackages = usePackages();
  
  return (
    <AppContext.Provider value={{ logs, recording, overlaySettings, availablePackages }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
