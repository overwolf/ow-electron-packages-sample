import React from 'react';
import LogView from './components/log-view';
import ViewsWrapper from './components/views-wrapper';
import Capture from './components/capture/capture';
import TopButtons from './components/top-buttons';

function App() {
  return (
    <div>
      <h1>OW Electron Sample App</h1>
      <TopButtons />
      <LogView />
      <Capture />
      <ViewsWrapper />
    </div>
  );
}

export default App;
