import React, { useContext } from 'react';
import CmpSettings from '../cmp/CmpSettings';
import OverlaySettings from '../overlay/OverlaySettings';
import SettingsOptionItem, { SettingsItemProps } from './app-settings-item';
import SectionHeader from '../layout/section-header';
import HotKeysSettings from '../hotkeys/hotkeys-settings';
import CheckForUpdates from '../check-for-updates/CheckForUpdates';
import DisplaySettings from '../display/DisplaySettings';
import ScreenshotSettings from '../screenshot/ScreenshotSettings';
import AppContext from '../../context/app-context';

const AppSettings: React.FC = () => {
  const { availablePackages } = useContext(AppContext);
  const settingsItems: SettingsItemProps[] = [
    {
      type: 'simple-type',
      title: 'Privacy Settings',
      description: 'Manage your privacy settings and data preferences',
      content: <CmpSettings />,
    },
    {
      type: 'expanded-type',
      title: 'Overlay Settings',
      description: 'Configure the in-game overlay behavior and hotkeys',
      content: <OverlaySettings />,
      isExpanded: true,
      isDisabled: !availablePackages.isPackageAvailable('overlay'),
    },
    {
      type: 'link-type',
      title: 'Recording settings',
      description: 'Capture, output',
      link: '/recording-settings',
      isDisabled: !availablePackages.isPackageAvailable('recorder'),
    },
    {
      type: 'expanded-type',
      title: 'Hotkeys',
      description: 'Overlay, in-game overlay, video',
      content: <HotKeysSettings />,
      isDisabled: !availablePackages.isPackageAvailable('overlay'),
    },
    {
      type: 'simple-type',
      title: 'Screenshot format',
      description: 'Choose the file format for screenshots (JPG or BMP)',
      content: <ScreenshotSettings />,
      isDisabled: !availablePackages.isPackageAvailable('overlay'),
    },
    {
      type: 'simple-type',
      title: 'Display',
      description: 'Choose which screen the app opens on',
      content: <DisplaySettings />,
    },
    {
      type: 'simple-type',
      title: 'Check for updates',
      description: 'Keep your app up to date with the latest features and fixes',
      content: <CheckForUpdates />,
    },
  ];

  return (
    <section className='settings-section'>
      <SectionHeader
        title='App Settings'
        description='Configure preferences, behaviors and hotkeys'
      />

      <ul className='settings-options-list'>
        {settingsItems.map((item, index) => (
          <SettingsOptionItem key={index} {...item} />
        ))}
      </ul>
    </section>
  );
};

export default AppSettings;
