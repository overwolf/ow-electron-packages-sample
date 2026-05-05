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
import type { overwolf } from '@overwolf/ow-electron';
import type {
  AudioDeviceParams,
  ExclusiveInputOptions,
  IOverlayHotkey,
  IOverwolfOverlayApi,
  IOverwolfRecordingApi,
  IOverwolfUtilityApi,
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
  namespace Electron {
    interface App {
      overwolf: overwolf.OverwolfApi & {
        packages: overwolf.packages.OverwolfPackageManager & {
          gep: overwolf.packages.OverwolfGameEventPackage;
          overlay: IOverwolfOverlayApi;
          recorder: IOverwolfRecordingApi;
          utility: IOverwolfUtilityApi;
        };
      };
    }
  }
  interface Window {
    recorder: Recorder;
    overlay: IOverlayApi;
    app: any;
    gep: any;
    osr: any;
    electronAPI: any;
    privacyApi: IPrivacyApi;
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
  }
}
