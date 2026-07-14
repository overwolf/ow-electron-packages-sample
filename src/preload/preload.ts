import {
  AudioDeviceSettingsInfo,
  CaptureReplayOptions,
  CaptureSettings,
  CaptureSettingsOptions,
  ExclusiveInputOptions,
  IOverlayHotkey,
  RecordingAppOptions,
  RecordingOptions,
  ReplayOptions,
} from '@overwolf/ow-electron-packages-types';
import { OverlayChannels, PackageChannelIpcChannels, UtilityChannels } from '../common/channels/channels';

console.log('** preload **');
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('app', {
  version: `ow-electron v${process.versions.electron}`,
  getAvailablePackages: () => {
    return ipcRenderer.invoke('get-available-packages');
  },
  onMessage: (func) => {
    ipcRenderer.on('console-message', (_e, data) => {
      const { message, type, args } = data;
      func(message, type ?? 'info', args);
    });
  },
  openFolderPicker: () => {
    return ipcRenderer.invoke('open-folder-picker');
  },
  openFolder: (...args) => {
    return ipcRenderer.invoke('open-folder', ...args);
  },
  scanGames: (...args) => {
    return ipcRenderer.invoke('scan-games', ...args);
  },
  onElevationHelperPrompt: (func: (gameName: string) => void) => {
    ipcRenderer.on('elevation-helper-prompt', (_e, gameName: string) => func(gameName));
  },
  sendElevationHelperResponse: (install: boolean) => {
    ipcRenderer.send('elevation-helper-response', install);
  },
  trackGames: (...args) => {
    return ipcRenderer.invoke('track-games', ...args);
  },
  disableAdsFPD: () => {
    return ipcRenderer.invoke('disable-ads-fpd');
  },
  disableAdsOptimization: () => {
    return ipcRenderer.invoke('disable-ads-optimization');
  },
  hasPendingUpdates: () => {
    return ipcRenderer.invoke('has-pending-updates');
  },
  checkForUpdates: () => {
    return ipcRenderer.invoke('check-for-updates');
  },
  getUtmParams: () => {
    return ipcRenderer.invoke('get-utm-params');
  },
  isHighElevationHelperInstalled: () => {
    return ipcRenderer.invoke(UtilityChannels.GET_HIGH_ELEVATION_HELPER_STATUS);
  
  },
  installHighElevationHelper: () => {
    return ipcRenderer.invoke(UtilityChannels.INSTALL_HIGH_ELEVATION_HELPER);
  },
});

contextBridge.exposeInMainWorld('privacyApi', {
  manageCMP: () => {
    return ipcRenderer.invoke('manage-cmp');
  },

  isCmpRequired: () => {
    return ipcRenderer.invoke('is-cmp-required');
  },

  generateEmailHashes: (email: string) => {
    return ipcRenderer.invoke('generate-email-hashes', email);
  },
  setUserEmailHashes: (hashes: overwolf.EmailHashes) => {
    return ipcRenderer.invoke('set-email-hashes', hashes);
  },
});

contextBridge.exposeInMainWorld('gep', {
  setRequiredFeature: () => {
    return ipcRenderer.invoke('gep-set-required-feature');
  },

  getInfo: () => {
    return ipcRenderer.invoke('gep-getInfo');
  },
});

contextBridge.exposeInMainWorld('osr', {
  openOSR: () => {
    return ipcRenderer.invoke(OverlayChannels.CREATE_IN_GAME_WINDOW);
  },
  openDPIOSR: () => {
    return ipcRenderer.invoke(OverlayChannels.CREATE_IN_GAME_DPI_WINDOW);
  },
  toggle: () => {
    return ipcRenderer.invoke(OverlayChannels.TOGGLE_OSR_VISIBILITY);
  },
  updateHotkey: () => {
    return ipcRenderer.invoke(OverlayChannels.UPDATE_HOTKEY);
  },
});

contextBridge.exposeInMainWorld('overlay', {
  setExclusiveModeType: (type: string) => {
    return ipcRenderer.invoke(OverlayChannels.SET_EXCLUSIVE_MODE_TYPE, type);
  },
  setExclusiveModeHotkeyBehavior: (behavior: string) => {
    return ipcRenderer.invoke(
      OverlayChannels.SET_EXCLUSIVE_MODE_HOTKEY_BEHAVIOR,
      behavior,
    );
  },
  updateNativeExclusiveModeOptions: (options: ExclusiveInputOptions) => {
    return ipcRenderer.invoke(
      OverlayChannels.UPDATE_NATIVE_EXCLUSIVE_MODE_OPTIONS,
      options,
    );
  },
  changeHotkey: (hotkey: IOverlayHotkey) => {
    return ipcRenderer.invoke(OverlayChannels.UPDATE_HOTKEY, hotkey);
  },
});

contextBridge.exposeInMainWorld('recorder', {
  onRecorderInfo: (func) => {
    ipcRenderer.on('recorder-info', (e, ...args) => {
      func(...args);
    });
  },
  onCaptureSettingsChanged: (func) => {
    ipcRenderer.on('capture-settings-changed', (e, ...args) => {
      func(...args);
    });
  },
  onRecordingStatusChanged: (func) => {
    ipcRenderer.on('recording-status-changed', (e, ...args) => {
      func(...args);
    });
  },

  onRecordingStatsChanged: (func) => {
    ipcRenderer.on('recording-stats', (e, ...args) => {
      func(...args);
    });
  },

  onCaptureOutputStarted: (func) => {
    ipcRenderer.on('capture-output-started', () => func());
  },

  getObsInfo: () => {
    return ipcRenderer.invoke('get-obs-info');
  },

  queryInfo: (overrideCache?: boolean) => {
    return ipcRenderer.invoke('query-info', overrideCache);
  },

  //recording-stats
  startCapture: () => {
    return ipcRenderer.invoke('start-capture');
  },
  stopCapture: () => {
    return ipcRenderer.invoke('stop-capture');
  },
  splitCapture: () => {
    return ipcRenderer.invoke('split-capture');
  },
  startReplays: () => {
    return ipcRenderer.invoke('start-replays');
  },
  stopReplays: () => {
    return ipcRenderer.invoke('stop-replays');
  },

  isRecording: () => {
    return ipcRenderer.invoke('is-recording');
  },

  setRecordingAppOptions: (recordingOptions: RecordingAppOptions) => {
    return ipcRenderer.invoke('set-recording-app-options', recordingOptions);
  },
  setCaptureSettingsOptions: (options: CaptureSettingsOptions) => {
    return ipcRenderer.invoke('set-capture-settings-options', options);
  },
  setCaptureSettings: (options: CaptureSettings) => {
    return ipcRenderer.invoke('set-capture-settings', options);
  },
  recorderReady: () => {
    return ipcRenderer.invoke('recorder-ready');
  },

  startCaptureReplay: () => {
    return ipcRenderer.invoke('start-capture-replay');
  },
  stopCaptureReplay: () => {
    return ipcRenderer.invoke('stop-capture-replay');
  },

  setOutputPath: (folderPath: string) => {
    return ipcRenderer.invoke('set-output-path', folderPath);
  },
  setRecordingDisplay: (displayAltId: string) => {
    return ipcRenderer.invoke('set-recorder-display', displayAltId);
  },
  setRecordingInputDevice: (device: AudioDeviceSettingsInfo) => {
    return ipcRenderer.invoke('set-recording-input-device', device);
  },
  setRecordingOutputDevice: (device: AudioDeviceSettingsInfo) => {
    return ipcRenderer.invoke('set-recording-output-device', device);
  },
  setAudioDevice: (devices: AudioDeviceSettingsInfo[]) => {
    return ipcRenderer.invoke('set-audio-devices', devices);
  },
  toggleAutoGameCapture: (enabled: boolean) => {
    return ipcRenderer.invoke('auto-game-capture', enabled);
  },

  enableReplays: (enable: boolean) => {
    return ipcRenderer.invoke('enable-replays', enable);
  },

  setRecordingOptions: (options: RecordingOptions) => {
    ipcRenderer.invoke('set-recording-options', options);
  },

  setReplayCaptureOptions: (options: CaptureReplayOptions) => {
    ipcRenderer.invoke('set-replay-capture-options', options);
  },
  setReplayOptions: (options: ReplayOptions) => {
    ipcRenderer.invoke('set-replay-options', options);
  },
});

contextBridge.exposeInMainWorld('packageChannels', {
  getAvailableChannels: () =>
    ipcRenderer.invoke(PackageChannelIpcChannels.GET_AVAILABLE),
  getCurrentChannels: () =>
    ipcRenderer.invoke(PackageChannelIpcChannels.GET_CURRENT),
  getPackageVersions: () =>
    ipcRenderer.invoke(PackageChannelIpcChannels.GET_VERSIONS),
  setChannel: (packageName: string, channel?: string) =>
    ipcRenderer.invoke(PackageChannelIpcChannels.SET, packageName, channel),
  relaunch: () =>
    ipcRenderer.invoke(PackageChannelIpcChannels.RELAUNCH),
  getLogsFolderPath: () =>
    ipcRenderer.invoke(PackageChannelIpcChannels.GET_LOGS_FOLDER),
  getInitFailures: () =>
    ipcRenderer.invoke(PackageChannelIpcChannels.GET_INIT_FAILURES),
  onChannelReady: (cb: (info: { name: string; version: string }) => void) => {
    ipcRenderer.on(PackageChannelIpcChannels.READY, (_e, info) => cb(info));
  },
  onUpdatePending: (
    cb: (packages: { name: string; version: string }[]) => void,
  ) => {
    ipcRenderer.on(PackageChannelIpcChannels.UPDATE_PENDING, (_e, packages) =>
      cb(packages ?? []),
    );
  },
  onInitFailed: (cb: (info: { name: string; reason: string }) => void) => {
    ipcRenderer.on(PackageChannelIpcChannels.INIT_FAILED, (_e, info) => cb(info));
  },
});

contextBridge.exposeInMainWorld('electronAPI', {
  maximize: () => {
    return ipcRenderer.invoke('maximize');
  },

  unmaximize: () => {
    return ipcRenderer.invoke('unmaximize');
  },

  minimize: () => {
    return ipcRenderer.invoke('minimize');
  },

  close: () => {
    return ipcRenderer.invoke('close');
  },

  getDisplays: () => {
    return ipcRenderer.invoke('get-displays');
  },

  moveToDisplay: (id: number) => {
    return ipcRenderer.invoke('move-to-display', id);
  },

  getScreenshotFormat: (): Promise<'jpg' | 'bmp'> => {
    return ipcRenderer.invoke('get-screenshot-format');
  },

  setScreenshotFormat: (format: 'jpg' | 'bmp'): Promise<void> => {
    return ipcRenderer.invoke('set-screenshot-format', format);
  },
});
