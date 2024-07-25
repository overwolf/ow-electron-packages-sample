import { ipcMain } from 'electron';
import { IRecordingService } from '../services/recording.service';
import {
  AudioDeviceSettingsInfo,
  CaptureReplayOptions,
  CaptureSettings,
  CaptureSettingsOptions,
  RecordingAppOptions,
  RecordingOptions,
  ReplayOptions,
} from '@overwolf/ow-electron-packages-types';

export interface IRecorderIPCService {}

export class RecorderIPCService implements IRecorderIPCService {
  constructor(private readonly recorderService: IRecordingService) {
    this.registerToRecorderCommands();
  }

  // ---------------------------------------------------------------------------
  private registerToRecorderCommands() {
    ipcMain.handle('get-obs-info', async () => {
      return this.recorderService.queryInformation();
    });

    ipcMain.handle('set-recording-options', (e, options: RecordingOptions) => {
      this.recorderService.recordingOptions = options;
    });

    ipcMain.handle('start-capture', async () => {
      return this.recorderService?.startRecording();
    });

    ipcMain.handle('is-recording', async () => {
      return this.recorderService?.isRecording();
    });

    // ipcMain.handle('recorder-ready', async () => {
    //   return this.recorderReady();
    // });

    ipcMain.handle('stop-capture', async () => {
      return this.recorderService?.stopRecording();
    });

    ipcMain.handle('split-capture', () => {
      return this.recorderService?.splitCapture();
    });

    ipcMain.handle('start-replays', async () => {
      return this.recorderService?.startReplays();
    });

    ipcMain.handle('stop-replays', async () => {
      return this.recorderService?.stopReplays();
    });

    ipcMain.handle('start-capture-replay', async () => {
      return this.recorderService?.startCaptureReplay();
    });

    ipcMain.handle('stop-capture-replay', async () => {
      return this.recorderService?.stopCaptureReplay();
    });

    ipcMain.handle(
      'set-recording-app-options',
      async (e, options: RecordingAppOptions) => {
        this.recorderService?.setRecordingAppOptions(options);
      },
    );

    ipcMain.handle(
      'set-capture-settings-options',
      async (e, options: CaptureSettingsOptions) => {
        try {
          if (!options) {
            return false;
          }

          this.recorderService.captureSettingsOptions = options;
          return true;
        } catch {
          return false;
        }
      },
    );

    ipcMain.handle(
      'set-capture-settings',
      async (e, captureSettings: CaptureSettings) => {
        try {
          if (!captureSettings) {
            return false;
          }

          this.recorderService.captureSettings = captureSettings;
          return true;
        } catch {
          return false;
        }
      },
    );

    ipcMain.handle(
      'set-replay-capture-options',
      async (e, options: CaptureReplayOptions) => {
        try {
          if (!options) {
            return false;
          }

          this.recorderService.replayCaptureOptions = options;
          return true;
        } catch {
          return false;
        }
      },
    );

    ipcMain.handle('set-replay-options', async (e, options: ReplayOptions) => {
      try {
        if (!options) {
          return false;
        }

        this.recorderService.replaysOptions = options;
        return true;
      } catch {
        return false;
      }
    });

    ipcMain.handle('set-output-path', async (e, folderPath: string) => {
      this.recorderService.setOutputPath(folderPath);
    });

    ipcMain.handle('set-recorder-display', (e, displayAltId: string) => {
      this.recorderService.setCaptureMonitorId(displayAltId);
    });

    ipcMain.handle(
      'set-audio-devices',
      (e, devices: AudioDeviceSettingsInfo[]) => {
        let newDevices: AudioDeviceSettingsInfo[] = devices;
        this.recorderService.setAudioDevices(newDevices);
      },
    );

    ipcMain.handle('auto-game-capture', (e, enabled) => {
      return (this.recorderService.autoGameCapture = enabled);
    });

  }
}

