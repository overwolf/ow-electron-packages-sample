import React from 'react';
import Capture from '../capture/capture';
import SectionHeader from '../layout/section-header';

const RecordingSettings: React.FC = () => {

  return (
    <section className='settings-section'>
      <SectionHeader
        title='Recording settings'
        description='Configure preferences, behaviors and hotkeys'
        prevPageTitle='App Settings'
        prevPageRoute='/app-settings'
      />
      <Capture />
    </section>
  );
};

export default RecordingSettings;
