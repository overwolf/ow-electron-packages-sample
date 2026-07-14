import React from 'react';
import LogView from './components/log-view';
import TopButtons from './components/top-buttons';

function App() {
  return (
    <div className="app-page">
      <LogView />

      {/* QA */}
      <TopButtons />
      {/* QA */}
    </div>
  );
}

export default App;
