import {
  AudioDeviceParams,
  AudioDeviceSettingsInfo,
  CaptureReplayOptions,
  CaptureSettingsOptions,
  RecorderStats,
  RecordingAppOptions,
  RecordingInformation,
  RecordingOptions,
  ReplayOptions,
} from '@overwolf/ow-electron-packages-types';
import React, { ChangeEvent, createContext } from 'react';
import { RecordingStatus } from '../../../common/recorder/recording-status';
import { AvailablePackages, UiCaptureSettings } from './context-types';

interface LogContext {
  logMessages?: string[];
  newLogMessage?: (message: string) => void;
  clearMessages?: () => void;
}

interface RecordingContext {
  recordingInfo?: RecordingInformation;
  recordingAppOptions?: RecordingAppOptions;
  recordingOptions?: RecordingOptions;
  outputPath?: string;
  replayCaptureOptions?: CaptureReplayOptions;
  replayOptions?: ReplayOptions;
  captureSettings?: UiCaptureSettings;
  captureSettingsOptions?: CaptureSettingsOptions;
  selectedDisplay?: string;
  selectedInputDevice?: AudioDeviceSettingsInfo;
  selectedOutputDevice?: AudioDeviceSettingsInfo;
  recordingStatus?: RecordingStatus;
  recordingStats?: RecorderStats;
  setRecordingInfo?: (info: RecordingInformation) => void;
  setRecordingAppOptions?: (info: RecordingAppOptions) => void;
  setRecordingOptions?: (info: RecordingOptions) => void;
  setOutputPath?: (path: string) => void;
  setCaptureSettingsOptions?: (info: CaptureSettingsOptions) => void;
  setCaptureSettings?: (settings: UiCaptureSettings) => void;
  setReplayCaptureOptions?: (options: CaptureReplayOptions) => void;
  setReplayOptions?: (options: ReplayOptions) => void;
  setSelectedDisplay?: (displayAltId: string) => void;
  setSelectedInputDevice?: (inputDevice: AudioDeviceSettingsInfo) => void;
  setSelectedOutputDevice?: (outputDevice: AudioDeviceSettingsInfo) => void;
}

// -----------------------------------------------------------------------------
interface OverlaySettingsContext {
  exclusiveBackgroundColor?: string;
  opacityValue?: string;
  animationDuration?: string;
  exclusiveModeType?: string;
  exclusiveHotkeyBehavior?: string;
  changeExclusiveBackgroundColor?: (e: ChangeEvent<HTMLInputElement>) => void;
  changeOpacityValue?: (e: ChangeEvent<HTMLInputElement>) => void;
  changeAnimationDurationValue?: (e: ChangeEvent<HTMLInputElement>) => void;
  changeExclusiveModeType?: (value: string) => void;
  changeExclusiveHotkeyBehavior?: (value: string) => void;
}
// -----------------------------------------------------------------------------

export type TAppContext = {
  logs?: LogContext;
  recording?: RecordingContext;
  overlaySettings?: OverlaySettingsContext;
  availablePackages?: AvailablePackages;
};

export const AppContext = createContext<TAppContext>({});

export default AppContext;
