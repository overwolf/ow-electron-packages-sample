import { app, ipcMain } from 'electron';
import { exec } from 'child_process';
import { PackageControllerBase } from '../base.controller';
import { RecordingService } from '../../services/recorder/recording.service';
import {
  IOverwolfRecordingApi,
  MonitorInfo,
  RecordingAppOptions,
  RecordingOptions,
  ReplayOptions,
  CaptureReplayOptions,
  CaptureSettings,
  CaptureSettingsOptions,
  GameInfo,
  RecordEventArgs,
  RecordStopEventArgs,
  SplitRecordArgs,
  ReplayVideo,
  AudioDeviceSettingsInfo,
} from '@overwolf/ow-electron-packages-types';

/**
 * Controller for the Recording package.
 * Wires package readiness, IPC handlers, and delegates behavior to the service.
 */
export class RecordingController extends PackageControllerBase {
  private _recorderApi: IOverwolfRecordingApi;
  private _recordingService: RecordingService;

  constructor() {
    super('recorder');
    this.registerToIpc();
  }

  protected onPackageReady(): void {
    this._recorderApi = app.overwolf.packages.recorder;

    if (!this._recorderApi) {
      this.log('Recorder API is not available after ready event');
      return;
    }

    // onPackageReady may be called multiple times (for example the package manager crashed or reloaded)
    if (!this._recordingService) {
      this._recordingService = new RecordingService(this._recorderApi);
    }
    this.forwardServiceEvents();

    this.registerToRecordingPackageEvents();

    // Send initial OBS/recorder information to renderer via main window
    this.emitInitialInfo();

    // Inform application that the recording package is ready
    this.emit('ready');
  }

  /**
   * Registers to the recording package events.
   */
  private registerToRecordingPackageEvents(): void {
    this._recorderApi.on('game-launched', (gameInfo: GameInfo) => {
      this.log('Game Launched', gameInfo);
      this._recordingService.onGameLaunched(gameInfo);
    });

    this._recorderApi.on('game-exit', (gameInfo: GameInfo) => {
      this.log('Game Exited', gameInfo);
      this._recordingService.onGameExit();
    });

    this._recorderApi.on(
      'recording-started',
      (recordEventArgs: RecordEventArgs) => {
        this.log('Recording Started', recordEventArgs);
        this.emit('capture-output-started');
      },
    );

    this._recorderApi.on(
      'recording-stopped',
      (recordStopEventArgs: RecordStopEventArgs) => {
        this.log('Recording Stopped', recordStopEventArgs);
      },
    );

    this._recorderApi.on('recording-split', (videoInfo: SplitRecordArgs) => {
      this.log('Recording Split', videoInfo);
    });

    this._recorderApi.on(
      'replays-started',
      (recordEventArgs: RecordEventArgs) => {
        this.log('Replays Started', recordEventArgs);
      },
    );

    this._recorderApi.on(
      'replays-stopped',
      (recordEventArgs: RecordEventArgs) => {
        this.log('Replays Stopped', recordEventArgs);
      },
    );

    this._recorderApi.on('replay-captured', (replayVideo: ReplayVideo) => {
      this.log('Replay Captured', replayVideo);
    });

  }

  public get service(): RecordingService {
    return this._recordingService;
  }

  public async queryMonitors(): Promise<MonitorInfo[] | null> {
    if (!this._recorderApi) return null;
    try {
      const info = await this._recorderApi.queryInformation();
      return info?.monitors ?? null;
    } catch {
      return null;
    }
  }

  // Expose selected properties for consumers (e.g., MainWindowController)
  public get captureSettings(): CaptureSettings {
    return this._recordingService?.captureSettings;
  }

  public get recordingOptions(): RecordingOptions {
    return this._recordingService?.recordingOptions;
  }

  public get replaysOptions(): ReplayOptions {
    return this._recordingService?.replaysOptions;
  }

  public get replayCaptureOptions(): CaptureReplayOptions {
    return this._recordingService?.replayCaptureOptions;
  }

  public get captureSettingsOptions(): CaptureSettingsOptions {
    return this._recordingService?.captureSettingsOptions;
  }

  public get outputFolder(): string {
    return this._recordingService?.outputFolder;
  }

  public async captureFromHotkey() {
    try {
      const isRecording = await this._recordingService.isRecording();
      if (isRecording) {
        await this._recordingService.onStopCapture();
      } else {
        await this._recordingService.onStartCapture();
      }
    } catch (error) {
      console.error('[RecordingController] - captureFromHotkey', error);
    }
  }

  public async onGepEvent(payload: { gameId: number; data: any }) {
    try {
      await this._recordingService.onGepEvent(payload.data);
    } catch (error) {
      console.error('[RecordingController] - onGepEvent', error);
    }
  }

  // ---------------------------------------------------------------------------
  private forwardServiceEvents() {
    this._recordingService.on('log', (logData: any, ...args: any[]) => {
      if (typeof logData === 'object') {
        this.emit('log', logData);
      } else {
        this.log(logData, ...args);
      }
    });
    this._recordingService.on('stats', (stats) => this.emit('stats', stats));
    this._recordingService.on('capture-settings-changed', () =>
      this.emit('capture-settings-changed'),
    );
    this._recordingService.on('recorder-status-changed', (status) =>
      this.emit('recorder-status-changed', status),
    );
    this._recordingService.on('error', (error) => this.log('error', error));
  }

  // ---------------------------------------------------------------------------
  private registerToIpc() {
    ipcMain.handle('get-obs-info', async () => {
      return this._recordingService.queryInformation();
    });

    ipcMain.handle('query-info', async (_event, overrideCache?: boolean) => {
      this.log(`query-info requested (overrideCache: ${overrideCache ?? false})`);
      try {
        const info = await this._recordingService.queryInformation(overrideCache);
        this.emit('recorder-info', info);
        return info;
      } catch (error) {
        this.log(`query-info error: ${error?.message ?? error}`);
        throw error;
      }
    });

    ipcMain.handle('start-capture', async () => {
      return this._recordingService.onStartCapture();
    });

    ipcMain.handle('is-recording', async () => {
      return this._recordingService?.isRecording();
    });

    ipcMain.handle('stop-capture', async () => {
      return this._recordingService?.onStopCapture();
    });

    ipcMain.handle('split-capture', () => {
      return this._recordingService?.onSplitCapture();
    });

    ipcMain.handle('start-replays', async () => {
      return this._recordingService.replaysTurnOn();
    });

    ipcMain.handle('stop-replays', async () => {
      return this._recordingService?.stopReplays();
    });

    ipcMain.handle('start-capture-replay', async () => {
      return this._recordingService?.startCaptureReplay();
    });

    ipcMain.handle('stop-capture-replay', async () => {
      return this._recordingService?.stopCaptureReplay();
    });

    ipcMain.handle(
      'set-recording-app-options',
      async (_e, options: RecordingAppOptions) => {
        this._recordingService?.setRecordingAppOptions(options);
      },
    );

    ipcMain.handle('set-recording-options', (_e, options: RecordingOptions) => {
      try {
        if (!options) {
          return;
        }
        this._recordingService.recordingOptions = options;
        this.log('set-recording-options', options);
      } catch (error) {
        console.error(
          '[RecordingController] - Error setting recording-options:',
          error,
        );
        return;
      }
    });

    ipcMain.handle(
      'set-capture-settings-options',
      async (_e, options: CaptureSettingsOptions) => {
        try {
          if (!options) return false;
          this._recordingService.captureSettingsOptions = options;
          this.log('set-capture-settings-options', options);
          return true;
        } catch (error) {
          console.error(
            '[RecordingController] - set-capture-settings-options',
            error,
          );
          return false;
        }
      },
    );

    ipcMain.handle(
      'set-capture-settings',
      async (_e, settings: CaptureSettings) => {
        try {
          if (!settings) return false;
          this._recordingService.captureSettings = settings;
          this.log('set-capture-settings', settings);
          return true;
        } catch (error) {
          console.error('[RecordingController] - set-capture-settings', error);
          return false;
        }
      },
    );

    ipcMain.handle(
      'set-replay-capture-options',
      async (_e, options: CaptureReplayOptions) => {
        try {
          if (!options) return false;
          this._recordingService.replayCaptureOptions = options;
          return true;
        } catch {
          return false;
        }
      },
    );

    ipcMain.handle('set-replay-options', async (_e, options: ReplayOptions) => {
      try {
        if (!options) return false;
        this._recordingService.replaysOptions = options;
        return true;
      } catch {
        return false;
      }
    });

    ipcMain.handle(
      'set-output-path',
      async (_e, folderPath?: string | null) => {
      this._recordingService.setOutputPath(folderPath);
      },
    );

    ipcMain.handle('set-recorder-display', (_e, displayAltId: string) => {
      if (displayAltId === undefined || displayAltId === null) return;
      this._recordingService.setCaptureMonitorId(displayAltId);
    });

    ipcMain.handle('set-recording-input-device', async (_e, inputDevice: AudioDeviceSettingsInfo) => {
      try {
        if (!inputDevice) return;
        // await this._recordingService.setRecordingInputDevice(inputDevice);
        await this._recordingService.setRecordingDevices(inputDevice, 'input');
      } catch (error) {
        console.error(
          '[RecordingController] - set-recording-input-device',
          error,
        );
      }
    });

    ipcMain.handle('set-recording-output-device', async (_e, outputDevice: AudioDeviceSettingsInfo) => {
      try {
        if (!outputDevice) return;
        // await this._recordingService.setRecordingOutputDevice(outputDevice);
        await this._recordingService.setRecordingDevices(outputDevice, 'output');
      } catch (error) {
        console.error(
          '[RecordingController] - set-recording-output-device',
          error,
        );
      }
    });

    ipcMain.handle('set-audio-devices', async (_e, devices) => {
      try {
        await this._recordingService.setAudioDevices(devices);
      } catch (error) {
        console.error(
          '[RecordingController] - set-audio-devices',
          error,
        );
      }
    });

    ipcMain.handle('auto-game-capture', (_e, enabled) => {
      return (this._recordingService.autoGameCapture = enabled);
    });
  }

  /**
   * Emits the initial OBS/recorder information to the renderer via main window
   */
  private emitInitialInfo(): void {
    this._recordingService.queryInformation().then((info) => {
      this.log('OBS - Info Loaded');
      this.emit('recorder-info', info);
    }).catch((error) => {
      this.log(
        'Error emitting initial info:',
        error,
      );
    });
  }
}
