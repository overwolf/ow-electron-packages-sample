import React from 'react';
import { createRoot } from 'react-dom/client';
import { SvgIcons } from '../app/styles/icons';
import OverlayWindowStyles from '../app/styles/overlay-window-styles';
import OverlayWindowHeader from './components/osr-window-header';
import GEPLogsDisplay from './components/gepLogger';
import MoreActionsButtons from './components/more-actions-buttons';
import Ad from '../app/components/ads-tester/ad';
import OverlayWindowSettings from './components/overlay-window-settings';
import { GepLogsProvider } from '../app/context/gep-logs-context';

const container = document.getElementById('osr-root');

const root = createRoot(container);

root.render(
  <GepLogsProvider>
    <div className="overlay-window-wrapper">
      <SvgIcons />
      <OverlayWindowStyles />

      <OverlayWindowHeader />

      <main>
        <GEPLogsDisplay />
        <OverlayWindowSettings />

        <Ad
          adSize={[400, 300]}
          id={'ad-container'}
          adName={'Ad container 400x300'}
          adViewIsActive={false}
        />

        {/* QA */}
        <MoreActionsButtons />
        {/* QA */}
      </main>
    </div>
  </GepLogsProvider>,
);
