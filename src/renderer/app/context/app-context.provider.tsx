import React, { FC, ReactNode, useEffect, useState } from 'react';
import AppContext from './app-context';
import {
  CaptureReplayOptions,
  CaptureSettings,
  CaptureSettingsOptions,
  EncoderSettingsAMF,
  EncoderSettingsNVENC,
  EncoderSettingsQuickSync,
  EncoderSettingsQuickSyncH264,
  EncoderSettingsX264,
  RecorderStats,
  RecordingAppOptions,
  RecordingInformation,
  RecordingOptions,
  ReplayOptions,
  VideoEncoderSettingsBase,
} from '@overwolf/ow-electron-packages-types';
import { RecordingActions } from '../api-actions/recording-actions';
import { AppActions } from '../api-actions/app-actions';
import { RecordingStatus } from '../../../common/recorder/recording-status';

interface Props {
  children: ReactNode;
}

export type UiVideoEncoderSettings =
  | VideoEncoderSettingsBase
  | EncoderSettingsNVENC
  | EncoderSettingsX264
  | EncoderSettingsAMF
  | EncoderSettingsQuickSync
  | EncoderSettingsQuickSyncH264;

export interface UiCaptureSettings extends CaptureSettings {
  videoEncoderSettings: UiVideoEncoderSettings;
}

// -----------------------------------------------------------------------------
const AppContextProvider: FC<Props> = ({ children }): JSX.Element => {
  const [logMessages, setLogMessages] = useState([]);
  const [recordingInfo, setRecordingInfo] = useState<RecordingInformation>();
  const [captureSettings, _setCaptureSettings] = useState<UiCaptureSettings>();
  const [recordingAppOptions, _setRecordingAppOptions] =
    useState<RecordingAppOptions>();

  const [recordingOptions, _setRecordingOptions] = useState<RecordingOptions>();
  const [replayCaptureOptions, _setReplayCaptureOptions] =
    useState<CaptureReplayOptions>();

  const [replayOptions, _setReplayOptions] = useState<ReplayOptions>();
  const [selectedDisplays, _setSelectedDisplays] = useState<string>();

  const [captureSettingsOptions, _setCaptureSettingsOptions] =
    useState<CaptureSettingsOptions>();

  const [recordingStatus, setRecordingStatus] =
    useState<RecordingStatus>('stopped');

  const [recordingStats, setRecordingStats] =
    useState<RecorderStats>();
  // ---------------------------------------------------------------------------
  const newLogMessage = (message: string) => {
    setLogMessages((prevMessages) => {
      console.log('message', message);
      return [...prevMessages, `${message}`];
    });
  };

  // ---------------------------------------------------------------------------
  const clearMessages = () => {
    setLogMessages([]);
  };

  // ---------------------------------------------------------------------------
  const init = async () => {
    try {
      AppActions.onMessage(handleLogMessage);
      RecordingActions.onCaptureSettingsChanged(handleCaptureSettingsChanged);
      RecordingActions.onRecordingStatusChanged(handleRecordingStatusChanged);
      RecordingActions.onRecordingStatsChanged(handleRecordingStatsChanged);

      // query default information
      const settings = await RecordingActions.getObsInfo();
      setRecordingInfo(settings.information);

      _setCaptureSettingsOptions({
        audioEncoder: settings.information.audio.defaultEncoder,
        videoEncoder: settings.information.video.defaultEncoder,
        includeDefaultAudioSources: true,
        separateAudioTracks: false,
      });

      settings.captureSettings.videoSettings.fps = 30;

      _setCaptureSettings(settings.captureSettings);

      setSelectedDisplays(
        settings.information.monitors.find(
          (d) => d?.isPrimary).altId);

      const recordingOptions = settings.recordingOptions;
      if (!recordingOptions) {
        return;
      }

      _setRecordingOptions(recordingOptions);
      _setReplayCaptureOptions({fileName: '', pastDuration : 30});

      const replayOptions = settings.replaysOptions;
      if (!replayOptions) {
        return;
      }

      _setReplayOptions(replayOptions);

      handleLogMessage(`OBS - Info Loaded`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    init();
  }, []);

  // ---------------------------------------------------------------------------
  const handleLogMessage = (...args) => {
    let item = '';
    args.forEach((arg) => {
      item = `${item}-${JSON.stringify(arg)}`;
    });

    newLogMessage(item);
  };

  const handleCaptureSettingsChanged = (settings: CaptureSettings) => {
    _setCaptureSettings(settings);
  };

  const handleRecordingStatusChanged = (status: RecordingStatus) => {
    setRecordingStatus(status);
  };

  const handleRecordingStatsChanged = (status: RecorderStats) => {
    setRecordingStats(status);
  };

  const setCaptureSettingsOptions = (options: CaptureSettingsOptions) => {
    _setCaptureSettingsOptions(options);
    RecordingActions.setCaptureSettingsOptions(options);
  };

  const setSelectedDisplays = (displayAltId: string) => {
    _setSelectedDisplays(displayAltId);
    RecordingActions.setRecordingDisplay(displayAltId);
  };

  const setCaptureSettings = (settings: CaptureSettings) => {
    _setCaptureSettings(settings);
    RecordingActions.setCaptureSettings(settings);
  };

  const setRecordingAppOptions = (options: RecordingAppOptions) => {
    _setRecordingAppOptions(options);
    RecordingActions.setRecordingAppOptions(options);
  };

  const setRecordingOptions = (options: RecordingOptions) => {
    _setRecordingOptions(options);
    RecordingActions.setRecordingOptions(options);
  };

  const setReplayCaptureOptions = (options: CaptureReplayOptions) => {
    _setReplayCaptureOptions(options);
    RecordingActions.setReplayCaptureOptions(options);
  };

  const setReplayOptions = (options: ReplayOptions) => {
    _setReplayOptions(options);
    RecordingActions.setReplayOptions(options);
  };

  const logs = {
    logMessages,
    newLogMessage,
    clearMessages,
  };

  const recording = {
    recordingInfo,
    recordingAppOptions,
    captureSettingsOptions,
    captureSettings,
    recordingOptions,
    replayCaptureOptions,
    replayOptions,
    selectedDisplays,
    recordingStatus,
    recordingStats,
    setRecordingInfo,
    setRecordingAppOptions,
    setCaptureSettingsOptions,
    setCaptureSettings,
    setRecordingOptions,
    setReplayCaptureOptions,
    setReplayOptions,
    setSelectedDisplays,
  };

  return (
    <AppContext.Provider value={{ logs, recording }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
