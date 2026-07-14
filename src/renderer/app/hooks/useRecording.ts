import { useEffect, useState } from 'react';
import { LogType } from './useLogs';
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

export function useRecording(newLogMessage: (msg: string, type?: string, args?: any[]) => void) {
  const [recordingInfo, setRecordingInfoState] =
    useState<RecordingInformation>();

  const [autoGameCapture, setAutoGameCaptureState] = useState(false);

  const setAutoGameCapture = (enabled: boolean) => {
    setAutoGameCaptureState(enabled);
    RecordingActions.toggleAutoGameCapture(enabled);
  };

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
  const [captureOutputStarted, setCaptureOutputStartedState] = useState(false);
  const [captureElapsed, setCaptureElapsedState] = useState(0);

  useEffect(() => {
    const active = recordingStatus === 'recording' || recordingStatus === 'replay-capture';
    if (!active) {
      setCaptureElapsedState(0);
      return;
    }
    setCaptureElapsedState(0);
    const interval = setInterval(() => {
      setCaptureElapsedState((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [recordingStatus]);
  //----------------------------------------------------------------------------

  useEffect(() => {
    const init = async () => {
      try {
        AppActions.onMessage(handleLogMessage);
        RecordingActions.onCaptureSettingsChanged(handleCaptureSettingsChanged);
        RecordingActions.onRecordingStatusChanged(handleRecordingStatusChanged);
        RecordingActions.onRecordingStatsChanged(handleRecordingStatsChanged);
        RecordingActions.onCaptureOutputStarted(() => {
          setCaptureOutputStartedState(true);
        });
        RecordingActions.onRecorderInfo((settings) => {
          setRecordingInfoState(settings.information);
          setAutoGameCaptureState(settings.autoGameCapture ?? false);
          setOutputPathState((prev) => prev || settings.outputFolder || '');

          setCaptureSettingsOptionsState((prev) =>
            prev ?? {
              audioEncoder: settings.information.audio.defaultEncoder,
              videoEncoder: settings.information.video.defaultEncoder,
              includeDefaultAudioSources: true,
              separateAudioTracks: false,
              ...settings.captureSettingsOptions,
            },
          );

          const initialCaptureSettings = {
            ...settings.captureSettings,
            videoSettings: {
              ...settings.captureSettings.videoSettings,
              fps: settings.captureSettings.videoSettings?.fps ?? 30,
            },
            videoEncoderSettings: {
              ...settings.captureSettings.videoEncoderSettings,
              bitrate:
                settings.captureSettings.videoEncoderSettings?.bitrate ?? 8000,
            },
          };

          setCaptureSettingsState((prev) => prev ?? initialCaptureSettings);

          const primaryDisplay =
            settings.information.monitors.find((d) => d?.isPrimary)?.altId ||
            '';
          setSelectedDisplayState((prev) => {
            if (prev || !primaryDisplay) {
              return prev;
            }

            RecordingActions.setRecordingDisplay(primaryDisplay);
            return primaryDisplay;
          });

          setRecordingOptionsState((prev) => prev ?? settings.recordingOptions);
          setReplayCaptureOptionsState(
            (prev) => prev ?? { fileName: '', pastDuration: 30 },
          );
          setReplayOptionsState((prev) => prev ?? settings.replaysOptions);

          // newLogMessage('OBS - Info Loaded');
        });
      } catch (e) {
        console.error(e);
      }
    };

    init();
  }, []);

  const handleLogMessage = (message: string, type: string = 'info', args?: any[]) => {
    newLogMessage(message, type as LogType, args);
  };

  return {
    recordingInfo,
    autoGameCapture,
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
    captureOutputStarted,
    captureElapsed,
    setRecordingAppOptions,
    setAutoGameCapture,
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
