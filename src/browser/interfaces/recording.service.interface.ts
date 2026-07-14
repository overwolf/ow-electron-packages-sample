import {
  GameInfo,
  RecordingAppOptions,
  AudioDeviceSettingsInfo,
  RecordingOptions,
  ReplayOptions,
  CaptureReplayOptions,
  CaptureSettings,
  CaptureSettingsOptions,
  AudioDeviceParams,
} from '@overwolf/ow-electron-packages-types';
import { IRecorderInformation } from '../../common/recorder/recorder-information';

export interface IRecordingService {
  queryInformation(overrideCache?: boolean): Promise<IRecorderInformation>;
  setCaptureMonitorId(displayAltId: string);
  setOutputPath(folderPath: string);
  isRecording(): Promise<boolean>;
  stopRecording(): Promise<void>;
  splitCapture(): Promise<void>;
  startReplays(): Promise<void>;
  stopReplays(): Promise<void>;
  startCaptureReplay(): Promise<void>;
  stopCaptureReplay(): Promise<void>;
  startRecording(game?: GameInfo): Promise<void>;
  setRecordingAppOptions(options: RecordingAppOptions): void;
  setAudioDevices(devices: AudioDeviceSettingsInfo[]): Promise<void>;
  setRecordingInputDevice(deviceId: AudioDeviceSettingsInfo): Promise<void>;
  setRecordingOutputDevice(deviceId: AudioDeviceSettingsInfo): Promise<void>;

  recordingOptions: RecordingOptions;
  autoGameCapture: boolean;
  replaysOptions: ReplayOptions;
  replayCaptureOptions: CaptureReplayOptions;
  captureSettings: CaptureSettings;
  captureSettingsOptions: CaptureSettingsOptions;
}
