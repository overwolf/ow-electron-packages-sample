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
  interface Window {
    recorder: Recorder;
    overlay: any;
    app: any;
    gep: any;
    osr: any;
  }

  interface Recorder {
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
    setAudioDevice: (devices: AudioDeviceSettingsInfo[]) => void;
    toggleAutoGameCapture: (enabled: boolean) => void;
    setRecordingOptions: (options: RecordingOptions) => void;
    setReplayCaptureOptions: (options: CaptureReplayOptions) => void;
    setReplayOptions: (options: ReplayOptions) => void;
    onCaptureSettingsChanged: (callback) => void
    onRecordingStatusChanged: (callback) => void
    onRecordingStatsChanged: (callback) => void
  }
}
