import {
  AudioDevice,
  AudioDeviceSettingsInfo,
  CaptureReplayOptions,
  CaptureSettings,
  CaptureSettingsOptions,
  RecorderStats,
  RecordingAppOptions,
  RecordingOptions,
  ReplayOptions,
  kFileFormat,
} from '@overwolf/ow-electron-packages-types';
import { RecordingStatus } from '../../../common/recorder/recording-status';
import { IRecorderInformation } from '../../../common/recorder/recorder-information';

/*
 UI binding
*/
export class RecordingActions {
  static queryInfo = async (overrideCache?: boolean) => {
    return window.recorder.queryInfo(overrideCache);
  };

  static startCapture = async () => {
    await window.recorder.startCapture();
  };

  static stopCapture = async () => {
    await window.recorder.stopCapture();
  };

  static splitCapture = async () => {
    await window.recorder.splitCapture();
  };

  static startReplays = async () => {
    await window.recorder.startReplays();
  };

  static stopReplays = async () => {
    await window.recorder.stopReplays();
  };

  static startCaptureReplay = async () => {
    await window.recorder.startCaptureReplay();
  };

  static stopCaptureReplay = async () => {
    await window.recorder.stopCaptureReplay();
  };

  static onRecorderInfo = async (
    callback: (info: IRecorderInformation) => void,
  ) => {
    window.recorder.onRecorderInfo(callback);
  };

  static setOutputPath = async (filePath: string) => {
    await window.recorder.setOutputPath(filePath);
  };

  static setRecordingDisplay = async (displayAltId: string) => {
    window.recorder.setRecordingDisplay(displayAltId);
  };

  static setRecordingInputDevice = async (
    inputDevice: AudioDeviceSettingsInfo,
  ) => {
    window.recorder.setRecordingInputDevice(inputDevice);
  };

  static setRecordingOutputDevice = async (
    outputDevice: AudioDeviceSettingsInfo,
  ) => {
    window.recorder.setRecordingOutputDevice(outputDevice);
  };

  static setAudioDevice = async (devices: AudioDeviceSettingsInfo[]) => {
    window.recorder.setAudioDevice(devices);
  };

  static setCaptureSettingsOptions = async (
    options: CaptureSettingsOptions,
  ) => {
    window.recorder.setCaptureSettingsOptions(options);
  };

  static setRecordingAppOptions = async (options: RecordingAppOptions) => {
    window.recorder.setRecordingAppOptions(options);
  };

  static setCaptureSettings = async (settings: CaptureSettings) => {
    window.recorder.setCaptureSettings(settings);
  };

  static toggleAutoGameCapture = async (enabled: boolean) => {
    window.recorder.toggleAutoGameCapture(enabled);
  };

  static setRecordingOptions = async (options: RecordingOptions) => {
    window.recorder.setRecordingOptions(options);
  };

  static setReplayCaptureOptions = async (options: CaptureReplayOptions) => {
    window.recorder.setReplayCaptureOptions(options);
  };

  static setReplayOptions = async (options: ReplayOptions) => {
    window.recorder.setReplayOptions(options);
  };

  static onCaptureSettingsChanged = async (
    callback: (settings: CaptureSettings) => void,
  ) => {
    window.recorder.onCaptureSettingsChanged(callback);
  };

  static onRecordingStatusChanged = async (
    callback: (status: RecordingStatus) => void,
  ) => {
    window.recorder.onRecordingStatusChanged(callback);
  };

  static onRecordingStatsChanged = async (
    callback: (status: RecorderStats) => void,
  ) => {
    window.recorder.onRecordingStatsChanged(callback);
  };

  static onCaptureOutputStarted = (callback: () => void) => {
    window.recorder.onCaptureOutputStarted(callback);
  };
}
