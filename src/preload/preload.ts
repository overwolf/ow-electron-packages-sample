import { AudioDeviceSettingsInfo, CaptureReplayOptions, CaptureSettings, CaptureSettingsOptions, RecordingAppOptions, RecordingOptions, ReplayOptions } from "@overwolf/ow-electron-packages-types";

console.log('** preload **');
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('app', {
  version: `ow-electron v${process.versions.electron}`,
  onMessage: (func) => {
    ipcRenderer.on('console-message', (e, ...args) => {
      func(...args);
    });
  },
  openFolderPicker: () => {
    return ipcRenderer.invoke('open-folder-picker');
  },
  openFolder: (...args) => {
    return ipcRenderer.invoke('open-folder', ...args);
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
    return ipcRenderer.invoke('createOSR');
  },
  toggle: () => {
    return ipcRenderer.invoke('toggleOSRVisibility');
  },
  updateHotkey: () => {
    return ipcRenderer.invoke('updateHotkey');
  },
});

contextBridge.exposeInMainWorld('overlay', {
  setExclusiveModeType: (mode) => {
    return ipcRenderer.invoke('EXCLUSIVE_TYPE', mode);
  },
  setExclusiveModeHotkeyBehavior: (behavior) => {
    return ipcRenderer.invoke('EXCLUSIVE_BEHAVIOR', behavior);
  },
  updateExclusiveOptions: (options) => {
    return ipcRenderer.invoke('updateExclusiveOptions', options);
  },
});

contextBridge.exposeInMainWorld('recorder', {
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

  getObsInfo: () => {
    return ipcRenderer.invoke('get-obs-info');
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

