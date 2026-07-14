import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import App from '../../app';
import AppSettings from '../app-settings/app-settings';
import AdView from '../ad-view';
import PackageChannels from '../package-channels/package-channels';
import RecordingSettings from '../app-settings/recording-settings';

function Routing(): React.ReactElement {
  return (
    <>
      <Routes>
        {/* Main view: */}
        <Route path="/" element={<App />} />

        {/* App Settings: */}
        <Route path="/app-settings" element={<AppSettings />} />

         {/* Recording Settings: */}
        <Route path="/recording-settings" element={<RecordingSettings />} />

        {/* Ads Tester: */}
        <Route path="/ads-tester" element={<AdView />} />

        {/* Package Channels: */}
        <Route path="/channels" element={<PackageChannels />} />

        {/* Default Route: */}
        <Route path="/" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default Routing;
