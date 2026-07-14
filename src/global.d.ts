import {
  AudioDeviceSettingsInfo,
  CaptureReplayOptions,
  CaptureSettings,
  CaptureSettingsOptions,
  RecordingAppOptions,
  RecordingInformation,
  RecordingOptions,
  ReplayOptions,
} from '@overwolf/ow-electron-packages-types';
import type {
  AudioDeviceParams,
  ExclusiveInputOptions,
  IOverlayHotkey,
} from '@overwolf/ow-electron-packages-types';
import { IRecorderInformation } from './common/recorder/recorder-information';

export {};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      owadview: React.DetailedHTMLProps<OwadviewTagProps, HTMLElement>;
    }

    interface OwadviewTagProps extends React.HTMLAttributes<HTMLElement> {
      slotsize?: string;
      cid?: string;
    }
  }
}

declare global {
  interface DisplayInfo {
    id: number;
    label: string;
    isCurrent: boolean;
  }

  interface ElectronAPI {
    maximize: () => void;
    unmaximize: () => void;
    minimize: () => void;
    close: () => void;
    getDisplays: () => Promise<DisplayInfo[]>;
    moveToDisplay: (id: number) => Promise<boolean>;
    getScreenshotFormat: () => Promise<'jpg' | 'bmp'>;
    setScreenshotFormat: (format: 'jpg' | 'bmp') => Promise<void>;
  }

  interface IPackageChannelsApi {
    getAvailableChannels: () => Promise<Record<string, string[]>>;
    getCurrentChannels: () => Promise<Record<string, string>>;
    getPackageVersions: () => Promise<Record<string, string>>;
    setChannel: (packageName: string, channel?: string) => Promise<{ success: boolean; error?: string }>;
    relaunch: () => Promise<void>;
    getLogsFolderPath: () => Promise<string | null>;
    getInitFailures: () => Promise<Record<string, string>>;
    onChannelReady: (cb: (info: { name: string; version: string }) => void) => void;
    onUpdatePending: (cb: (packages: { name: string; version: string }[]) => void) => void;
    onInitFailed: (cb: (info: { name: string; reason: string }) => void) => void;
  }

  interface Window {
    recorder: Recorder;
    overlay: IOverlayApi;
    app: IDesktopAppApi;
    gep: any;
    osr: any;
    electronAPI: ElectronAPI;
    privacyApi: IPrivacyApi;
    packageChannels: IPackageChannelsApi;
  }

  //----------------------------------------------------------------------------
  interface IDesktopAppApi {
    version: string;
    getAvailablePackages: () => Promise<string[]>;
    onMessage: (callback: (...args: any[]) => void) => void;
    openFolderPicker: () => Promise<{ filePaths: string[] }>;
    openFolder: (path: string) => Promise<boolean>;
    scanGames: () => Promise<void>;
    trackGames: (classId?: number) => Promise<any>;
    disableAdsFPD: () => Promise<void>;
    disableAdsOptimization: () => Promise<void>;
    hasPendingUpdates: () => Promise<void>;
    checkForUpdates: () => Promise<void>;
    isHighElevationHelperInstalled: () => Promise<boolean>;
    installHighElevationHelper: () => Promise<boolean>;
    getUtmParams: () => Promise<string | null>;
  }

  //----------------------------------------------------------------------------
  interface IOverlayApi {
    hotkey: IOverlayHotkey;
    setExclusiveModeType: (type: string) => void;
    setExclusiveModeHotkeyBehavior: (behavior: string) => void;
    updateNativeExclusiveModeOptions: (options: ExclusiveInputOptions) => void;
    changeHotkey: (hotkey: IOverlayHotkey) => void;
  }

  //----------------------------------------------------------------------------
  interface IPrivacyApi {
    manageCMP: () => void;
    isCmpRequired: () => void;
    generateEmailHashes: (email: string) => void;
    setUserEmailHashes: (hashes: overwolf.EmailHashes) => void;
  }
  //----------------------------------------------------------------------------

  interface Recorder {
    onRecorderInfo: (callback: (info: IRecorderInformation) => void) => void;
    isRecording: () => Promise<boolean>;
    setRecordingAppOptions: (recordingOptions: RecordingAppOptions) => void;
    setCaptureSettingsOptions: (options: CaptureSettingsOptions) => void;
    setCaptureSettings: (options: CaptureSettings) => void;
    recorderReady: () => Promise<boolean>;
    startCapture: () => void;
    stopCapture: () => void;
    splitCapture: () => void;
    startReplays: () => void;
    stopReplays: () => void;
    startCaptureReplay: () => void;
    stopCaptureReplay: () => void;
    getObsInfo: () => Promise<IRecorderInformation>;
    queryInfo: (overrideCache?: boolean) => Promise<IRecorderInformation>;
    setOutputPath: (folderPath: string) => void;
    setRecordingDisplay: (displayAltId: string) => void;
    setRecordingInputDevice: (inputDevice: AudioDeviceSettingsInfo) => void;
    setRecordingOutputDevice: (outputDevice: AudioDeviceSettingsInfo) => void;
    setAudioDevice: (devices: AudioDeviceSettingsInfo[]) => void;
    toggleAutoGameCapture: (enabled: boolean) => void;
    setRecordingOptions: (options: RecordingOptions) => void;
    setReplayCaptureOptions: (options: CaptureReplayOptions) => void;
    setReplayOptions: (options: ReplayOptions) => void;
    onCaptureSettingsChanged: (callback) => void;
    onRecordingStatusChanged: (callback) => void;
    onRecordingStatsChanged: (callback) => void;
    onCaptureOutputStarted: (callback: () => void) => void;
  }
}
