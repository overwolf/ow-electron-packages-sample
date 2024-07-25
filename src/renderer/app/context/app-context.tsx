import {
  CaptureReplayOptions,
  CaptureSettingsOptions,
  RecorderStats,
  RecordingAppOptions,
  RecordingInformation,
  RecordingOptions,
  ReplayOptions,
} from '@overwolf/ow-electron-packages-types';
import React, { createContext } from 'react';
import { UiCaptureSettings } from './app-context.provider';
import { RecordingStatus } from '../../../common/recorder/recording-status';

interface LogContext {
  logMessages?: string[];
  newLogMessage?: (message: string) => void;
  clearMessages?: () => void;
}

interface RecordingContext {
  recordingInfo?: RecordingInformation;
  recordingAppOptions?: RecordingAppOptions;
  recordingOptions?: RecordingOptions;
  replayCaptureOptions?: CaptureReplayOptions;
  replayOptions?: ReplayOptions;
  captureSettings?: UiCaptureSettings;
  captureSettingsOptions?: CaptureSettingsOptions;
  selectedDisplays?: string;
  recordingStatus?: RecordingStatus;
  recordingStats?: RecorderStats;
  setRecordingInfo?: (info: RecordingInformation) => void;
  setRecordingAppOptions?: (info: RecordingAppOptions) => void;
  setRecordingOptions?: (info: RecordingOptions) => void;
  setCaptureSettingsOptions?: (info: CaptureSettingsOptions) => void;
  setCaptureSettings?: (settings: UiCaptureSettings) => void;
  setReplayCaptureOptions?: (options: CaptureReplayOptions) => void;
  setReplayOptions?: (options: ReplayOptions) => void;
  setSelectedDisplays? :(displayAltId: string) => void;
}

export type TAppContext = {
  logs?: LogContext;
  recording?: RecordingContext;
};

export const AppContext = createContext<TAppContext>({});

export default AppContext;
