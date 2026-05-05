import { useEffect, useState } from 'react';
import { AppActions } from '../api-actions/app-actions';
import { RecordingActions } from '../api-actions/recording-actions';
import {
  CaptureReplayOptions,
  CaptureSettings,
  CaptureSettingsOptions,
  RecordingAppOptions,
  RecordingInformation,
  RecordingOptions,
  ReplayOptions,
  RecorderStats,
  AudioDeviceParams,
  AudioDeviceSettingsInfo,
} from '@overwolf/ow-electron-packages-types';
import { RecordingStatus } from '../../../common/recorder/recording-status';

export function useRecording(newLogMessage: (msg: string) => void) {
  const [recordingInfo, setRecordingInfoState] =
    useState<RecordingInformation>();

  //----------------------------------------------------------------------------
  const [captureSettings, setCaptureSettingsState] =
    useState<CaptureSettings>();

  const handleCaptureSettingsChanged = (settings: CaptureSettings) => {
    setCaptureSettingsState(settings);
  };

  const setCaptureSettings = (settings: CaptureSettings) => {
    setCaptureSettingsState(settings);
    RecordingActions.setCaptureSettings(settings);
  };
  //----------------------------------------------------------------------------
  const [recordingAppOptions, setRecordingAppOptionsState] =
    useState<RecordingAppOptions>();

  const setRecordingAppOptions = (opts: RecordingAppOptions) => {
    setRecordingAppOptionsState(opts);
    RecordingActions.setRecordingAppOptions(opts);
  };
  //----------------------------------------------------------------------------
  const [recordingOptions, setRecordingOptionsState] =
    useState<RecordingOptions>();

  const setRecordingOptions = (opts: RecordingOptions) => {
    setRecordingOptionsState(opts);
    RecordingActions.setRecordingOptions(opts);
  };
  //----------------------------------------------------------------------------
  const [outputPath, setOutputPathState] = useState<string>('');
  const setOutputPath = (path: string) => {
    setOutputPathState(path);
    RecordingActions.setOutputPath(path);
  };
  //----------------------------------------------------------------------------
  const [replayCaptureOptions, setReplayCaptureOptionsState] =
    useState<CaptureReplayOptions>();

  const setReplayCaptureOptions = (opts: CaptureReplayOptions) => {
    setReplayCaptureOptionsState(opts);
    RecordingActions.setReplayCaptureOptions(opts);
  };
  //----------------------------------------------------------------------------
  const [replayOptions, setReplayOptionsState] = useState<ReplayOptions>();

  const setReplayOptions = (opts: ReplayOptions) => {
    setReplayOptionsState(opts);
    RecordingActions.setReplayOptions(opts);
  };

  //----------------------------------------------------------------------------
  const [selectedDisplay, setSelectedDisplayState] = useState<string>();

  const setSelectedDisplay = (displayAltId: string) => {
    setSelectedDisplayState(displayAltId);
    RecordingActions.setRecordingDisplay(displayAltId);
  };
  //----------------------------------------------------------------------------
  const [selectedInputDevice, setSelectedInputDeviceState] =
    useState<AudioDeviceSettingsInfo>({
      id: 'default',
      name: 'Mic',
      type: 'input',
    });

  const setSelectedInputDevice = (inputDevice: AudioDeviceSettingsInfo) => {
    setSelectedInputDeviceState(inputDevice);
    RecordingActions.setRecordingInputDevice(inputDevice);
  };
  //----------------------------------------------------------------------------
  const [selectedOutputDevice, setSelectedOutputDeviceState] =
    useState<AudioDeviceSettingsInfo>({
      id: 'default',
      name: 'Desktop',
      type: 'output',
    });

  const setSelectedOutputDevice = (outputDevice: AudioDeviceSettingsInfo) => {
    setSelectedOutputDeviceState(outputDevice);
    RecordingActions.setRecordingOutputDevice(outputDevice);
  };
  //----------------------------------------------------------------------------
  const [captureSettingsOptions, setCaptureSettingsOptionsState] =
    useState<CaptureSettingsOptions>();

  const setCaptureSettingsOptions = (opts: CaptureSettingsOptions) => {
    setCaptureSettingsOptionsState(opts);
    RecordingActions.setCaptureSettingsOptions(opts);
  };

  //----------------------------------------------------------------------------
  const [recordingStatus, setRecordingStatusState] =
    useState<RecordingStatus>('stopped');

  const handleRecordingStatusChanged = (status: RecordingStatus) => {
    setRecordingStatusState(status);
  };
  //----------------------------------------------------------------------------
  const [recordingStats, setRecordingStatsState] = useState<RecorderStats>();

  const handleRecordingStatsChanged = (stats: RecorderStats) => {
    setRecordingStatsState(stats);
  };
  //----------------------------------------------------------------------------

  useEffect(() => {
    const init = async () => {
      try {
        AppActions.onMessage(handleLogMessage);
        RecordingActions.onCaptureSettingsChanged(handleCaptureSettingsChanged);
        RecordingActions.onRecordingStatusChanged(handleRecordingStatusChanged);
        RecordingActions.onRecordingStatsChanged(handleRecordingStatsChanged);
        RecordingActions.onRecorderInfo((settings) => {
          setRecordingInfoState(settings.information);

          setCaptureSettingsOptionsState({
            audioEncoder: settings.information.audio.defaultEncoder,
            videoEncoder: settings.information.video.defaultEncoder,
            includeDefaultAudioSources: true,
            separateAudioTracks: false,
          });

          settings.captureSettings.videoSettings.fps = 30;
          settings.captureSettings.videoEncoderSettings.bitrate = 8000;

          setCaptureSettingsState(settings.captureSettings);
          setSelectedDisplay(
            settings.information.monitors.find((d) => d?.isPrimary)?.altId ||
              '',
          );

          setRecordingOptionsState(settings.recordingOptions);
          setReplayCaptureOptionsState({ fileName: '', pastDuration: 30 });
          setReplayOptionsState(settings.replaysOptions);

          // newLogMessage('OBS - Info Loaded');
        });
      } catch (e) {
        console.error(e);
      }
    };

    init();
  }, []);

  const handleLogMessage = (...args: any[]) => {
    let item = '';
    args.forEach((arg) => {
      item = `${item}-${JSON.stringify(arg)}`;
    });
    newLogMessage(item);
  };

  return {
    recordingInfo,
    recordingAppOptions,
    captureSettingsOptions,
    captureSettings,
    recordingOptions,
    outputPath,
    replayCaptureOptions,
    replayOptions,
    selectedDisplay,
    selectedInputDevice,
    selectedOutputDevice,
    recordingStatus,
    recordingStats,
    setRecordingAppOptions,
    setCaptureSettingsOptions,
    setCaptureSettings,
    setRecordingOptions,
    setOutputPath,
    setReplayCaptureOptions,
    setReplayOptions,
    setSelectedDisplay,
    setSelectedInputDevice,
    setSelectedOutputDevice,
  };
}
