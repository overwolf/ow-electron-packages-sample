import { app as electronApp, ipcMain } from 'electron';
import { overwolf } from '@overwolf/ow-electron';
import {
  ActiveReplay,
  IOverwolfRecordingApi,
  OWPackages,
  RecordingOptions,
  CaptureSettingsOptions,
  RecordingAppOptions,
  GameInfo,
  CaptureSettings,
  SplitRecordArgs,
  ReplayVideo,
  RecordEventArgs,
  CaptureReplayOptions,
  ReplayOptions,
  RecorderStats,
  AudioDeviceSettingsInfo,
  CaptureSettingsBuilder,
} from '@overwolf/ow-electron-packages-types';
import EventEmitter from 'events';
import path from 'path';
import {
  IRecorderIPCService,
  RecorderIPCService,
} from '../ipc/recorder-service-ipc';
import { IRecorderInformation } from '../../common/recorder/recorder-information';

const app = electronApp as overwolf.OverwolfApp;
const owElectronPackages = app.overwolf.packages as OWPackages;

const kDefaultOutputPath = path.join(app.getPath('videos'), app.name);

const kReplayBufferSeconds = 60;

export interface IRecordingService {
  queryInformation(): Promise<IRecorderInformation>;
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
  recordingOptions: RecordingOptions;
  autoGameCapture: boolean;
  replaysOptions: ReplayOptions;
  replayCaptureOptions: CaptureReplayOptions;
  captureSettings: CaptureSettings;
  captureSettingsOptions: CaptureSettingsOptions;
}

/**
 * Recording service
 */
export class RecordingService extends EventEmitter {
  // public recordingAppOptions: RecordingAppOptions;
  private initPromise: Promise<void>;

  // current capture settings
  private activeReplay?: ActiveReplay;

  private displayCaptureId: string;

  private outPutFolder: string = kDefaultOutputPath;

  private readonly ipcHandler: IRecorderIPCService = new RecorderIPCService(
    this,
  );

  // ---------------------------------------------------------------------------
  constructor() {
    super();
    this.safeInit();
  }

  // save the default recording/replay's options
  // so we can use it when auto game capture is on...
  // (this is not mandatory, just for this sample)
  public recordingOptions: RecordingOptions;
  public replaysOptions: ReplayOptions;
  public replayCaptureOptions: CaptureReplayOptions;

  public autoGameCapture: boolean = true;

  // saving the update (from UI) setting, used for advanced settings
  // (this is not mandatory, just for this sample)
  public captureSettings: CaptureSettings = null;
  public captureSettingsOptions: CaptureSettingsOptions;

  public async startRecording(game: GameInfo = null) {
    // If capture settings are null, we load the simple default settings for capture
    // otherwise the settings changed in UI and we want to use the changed settings.
    if (!this.captureSettings) {
      await this.startSimpleRecording(game);
    } else {
      await this.startAdvancedRecording(game);
    }
  }

  // ---------------------------------------------------------------------------
  public async stopRecording() {
    try {
      const recording = await this.isRecording();
      if (!recording) {
        return;
      }

      await this.recorderApi?.stopRecording((stopResult) => {
        this.emit('log', 'Recording stopped ', stopResult);
        this.emit('recorder-status-changed', 'stopped');
      });
    } catch (err) {
      this.emit('log', 'recorder-stop-error', err);
      console.error('STOP ERROR', err);
      return;
    }
  }

  // ---------------------------------------------------------------------------
  public async startCaptureReplay() {
    try {
      const fileName = this.generateFileNameFormat('replay-capture');

      this.replayCaptureOptions.fileName = fileName;
      this.activeReplay = await this.recorderApi?.captureReplay(
        this.replayCaptureOptions,
        (video) => {
          this.emit('log', '**** replay video ready ', video);
          this.emit('recorder-status-changed', 'replay');
          this.activeReplay = undefined;
        },
      );
      this.emit('recorder-status-changed', 'replay-capture');
      this.emit('log', 'Start Capture Replay');
    } catch (error) {
      this.emit('log', 'Error starting capture replay', error.message);
    }
  }

  // ---------------------------------------------------------------------------
  public async delayCapture() {
    try {
      if (!this.activeReplay) {
        await this.startCaptureReplay();
      }

      this.activeReplay?.stopAfter(10000);
    } catch (error) {
      this.emit('log', 'Error starting capture replay', error.message);
    }
  }

  // ---------------------------------------------------------------------------
  public async stopCaptureReplay() {
    try {
      this.emit('log', 'Stop Capture Replay');
      this.activeReplay?.stop();
    } catch (error) {
      this.emit('log', 'Error stopping capture replay', error);
    }
  }

  // ---------------------------------------------------------------------------
  public async startReplays() {
    try {
      if (!this.captureSettings) {
        await this.startReplaysSimple();
      } else {
        await this.startReplaysAdvanced();
      }
    } catch (err) {
      this.emit('log', 'START replay ERROR', err);
      return;
    }
  }

  // ---------------------------------------------------------------------------
  public async stopReplays() {
    try {
      this.emit('log', 'Stop replays');
      this.emit('recorder-status-changed', 'stopped');
      await this.recorderApi?.stopReplays();
    } catch (err) {
      this.emit('log', 'Stop replay ew', err);
      return;
    }
  }

  // ---------------------------------------------------------------------------
  public setCaptureMonitorId(displayAltId: string) {
    this.displayCaptureId = displayAltId;
  }

  // ---------------------------------------------------------------------------
  public setOutputPath(folderPath: string) {
    this.outPutFolder = folderPath;
  }
  // ---------------------------------------------------------------------------
  public async queryInformation(): Promise<IRecorderInformation> {
    try {
      await this.initPromise;

      const obsInfo = await this.recorderApi?.queryInformation();

      const settings = (
        await this.createCaptureOptions({
          separateAudioTracks: false,
          includeDefaultAudioSources: true, // add default input/ out devices
        })
      ).build();

      return {
        information: obsInfo,
        recordingOptions: this.recordingOptions,
        replaysOptions: this.replaysOptions,
        captureSettings: settings,
        captureSettingsOptions: this.captureSettingsOptions,
      };
    } catch (error) {
      this.emit('log', 'Error obtaining query Information', error);
    }
  }

  // ---------------------------------------------------------------------------
  public async isRecording(): Promise<boolean> {
    try {
      return this.recorderApi?.isActive();
    } catch (error) {
      this.emit('log', 'Error While checking Recorder status', error);
    }
  }

  // ---------------------------------------------------------------------------
  public async splitCapture() {
    try {
      return this.recorderApi?.splitRecording((split) => {
        this.emit('log', 'recording split result (callback) ', split);
      });
    } catch (error) {
      this.emit('log', 'Error Splitting capture ', error);
    }
  }

  // ---------------------------------------------------------------------------
  public setRecordingAppOptions(options: RecordingAppOptions) {
    try {
      if (!this.recorderApi) {
        return;
      }

      for (const prop in options) {
        this.recorderApi.options[prop] = options[prop];
      }
    } catch (error) {
      this.emit('log', 'Error setting app options', error);
    }
  }

  // ---------------------------------------------------------------------------
  public async setAudioDevices(devices: AudioDeviceSettingsInfo[]) {
    const input = devices.filter((d) => d.type === 'input');
    const output = devices.filter((d) => d.type === 'output');
    try {
      if (!this.captureSettings) {
        this.captureSettings = (
          await this.createCaptureOptions(this.captureSettingsOptions)
        ).build();
      }

      this.captureSettings.audioSettings.inputs = input;
      this.captureSettings.audioSettings.outputs = output;
      this.emit('capture-settings-changed');
    } catch (error) {
      this.emit('log', 'Error while setting Audio Device', error.message);
    }
  }

  //----------------------------------------------------------------------------
  private safeInit() {
    // all recorder command need to execute after initPromise is resolved
    this.initPromise = this.awaitReady();
  }

  //----------------------------------------------------------------------------
  // wait for package 'ready' event
  private async awaitReady() {
    return new Promise<void>((resolve) => {
      owElectronPackages.on('ready', async (e, packageName) => {
        // @ts-ignore
        // will be fix in the next ow-electron.d.ts version
        if (packageName !== 'recorder') {
          return;
        }

        this.registerRecorderListeners();

        this.registerGames();

        this.createDefaultSimpleOptions();

        resolve();
      });
    });
  }

  private async createCaptureOptions(
    options: CaptureSettingsOptions,
  ): Promise<CaptureSettingsBuilder> {
    try {
      return this.recorderApi?.createSettingsBuilder(options);
    } catch {}
  }

  private createDefaultSimpleOptions() {
    this.recordingOptions = {
      autoShutdownOnGameExit: true,
      // will be replace we we start the actual recording
      filePath: path.join(this.outPutFolder, 'dummy'),
    };

    this.replaysOptions = {
      bufferSecond: kReplayBufferSeconds,
      rootFolder: this.outPutFolder,
      autoShutdownOnGameExit: true,
    };

    this.replayCaptureOptions = {
      pastDuration: 30,
      fileName: this.generateFileNameFormat('replay-capture'),
    };

    this.captureSettingsOptions = {
      includeDefaultAudioSources: true,
      separateAudioTracks: false,
    };
  }

  // ---------------------------------------------------------------------------
  private registerRecorderListeners() {
    try {
      this.recorderApi?.on('game-launched', this.onGameLaunched.bind(this));
      this.recorderApi?.on('recording-split', this.onRecordingSplit.bind(this));
      this.recorderApi?.on('replay-captured', this.onReplayReady.bind(this));
      this.recorderApi?.on('replays-stopped', this.onReplaysStop.bind(this));
      this.recorderApi?.on('replays-started', this.onReplaysStart.bind(this));
      this.recorderApi?.on('game-exit', this.onGameExit.bind(this));
      this.recorderApi?.on('stats', this.onRecordingStats.bind(this));
    } catch (error) {
      this.emit('log', 'Error while registering listeners', error);
    }
  }

  // ---------------------------------------------------------------------------
  private removeRecorderListeners() {
    let recorder = this.recorderApi as unknown as EventEmitter;
    recorder?.removeListener('game-exit', this.onGameExit.bind(this));
    recorder?.removeListener('game-launched', this.onGameLaunched.bind(this));
    recorder?.removeListener(
      'recording-split',
      this.onRecordingSplit.bind(this),
    );
    recorder?.removeListener('replay-ready', this.onReplayReady.bind(this));
    recorder?.removeListener('replays-stop', this.onReplaysStop.bind(this));
    recorder?.removeListener('replays-start', this.onReplaysStart.bind(this));
    recorder?.removeListener('game-exit', this.onRecordingStats.bind(this));
  }

  // ---------------------------------------------------------------------------
  private registerGames() {
    try {
      this.recorderApi?.registerGames({
        gamesIds: [],
        all: true,
      });
    } catch (error) {
      this.emit('log', 'Error while registering games', error);
    }
  }
  i;

  // ---------------------------------------------------------------------------
  // Starting Game or Desktop simple setting recording..
  private async startSimpleRecording(gameInfo: GameInfo = null) {
    try {
      const settings = await this.createCaptureOptions({
        ...this.captureSettingsOptions,
      });

      /* changing  default video settings
       settings.videoSettings.fps = 60;
       settings.videoSettings.baseWidth = 1920;
       settings.videoSettings.baseHeight =1080;
      */

      if (gameInfo) {
        // game capture
        settings.addGameSource({
          gameProcess: gameInfo.processInfo.pid, // or just 'Game.exe' name
          captureOverlays: true, //
        });
      } else {
        // desktop capture
        settings.addScreenSource({ monitorId: this.displayCaptureId });
      }

      /* example how to create capture game sound only */
      /* ********************************************* */

      /*
        const settings = await this.createCaptureOptions({
          includeDefaultAudioSources: false,
        });

        const processName = path.basename(gameInfo.processInfo?.fullPath || '');
        // capture game sound only
        settings.addAudioDefaultCapture('input', {
          separateAudioTracks: false,
        });
        // add game process name
        settings.addApplicationAudioCapture({ processName: processName });
        // to add another application capture
        settings.addApplicationAudioCapture({ processName: 'Discord.exe' });
      */

      /* ********************************************* */
      const fileName = this.generateFileNameFormat(gameInfo?.name ?? 'desktop');
      await this.recorderApi?.startRecording(
        {
          filePath: path.join(this.outPutFolder, fileName),
          autoShutdownOnGameExit: true, // will auto close the
          ...this.recordingOptions,
        },
        settings.build(),
        (stopResult) => {
          this.emit('log', 'Recording stopped ', stopResult);
        },
      );

      this.emit('log', 'Recording Started');

      this.emit('recorder-status-changed', 'recording');

      // we can also start the replays
      /*
        this.replaysOptions.rootFolder = path.join(this.outPutFolder, 'replays');
        await this.recorderApi?.startReplays(
          this.replaysOptions,
        );
      */
    } catch (err) {
      // if (error instanceof RecorderError) {... }
      this.emit('start simple recording error', 'recording', err.message);
    }
  }

  // ---------------------------------------------------------------------------
  private async startAdvancedRecording(game: GameInfo = null) {
    try {
      const settingsBuilder = await this.createCaptureOptions({
        ...this.captureSettingsOptions,
      });

      if (this.captureSettings) {
        settingsBuilder.audioEncoder = this.captureSettings.audioEncoder;
        settingsBuilder.videoSettings = this.captureSettings.videoSettings;
        settingsBuilder.videoEncoderSettings =
          this.captureSettings.videoEncoderSettings;
        settingsBuilder.audioEncoder = this.captureSettings.audioEncoder;
      }

      const settings = settingsBuilder.build();
      settings.sources = [];

      if (game) {
        settingsBuilder.addGameSource({
          gameProcess: game.processInfo.pid,
          captureOverlays: true,
        });
      } else {
        settingsBuilder.addScreenSource({ monitorId: this.displayCaptureId });
      }

      const fileName = this.generateFileNameFormat(
        game ? game.name : 'desktop',
      );

      this.recordingOptions.filePath = path.join(this.outPutFolder, fileName);

      await this.recorderApi?.startRecording(
        this.recordingOptions,
        settingsBuilder,
        (stopResult) => {
          this.emit('log', 'Recording stopped ', stopResult);
        },
      );
      this.emit('recorder-status-changed', 'recording');
      this.emit('log', 'Recording started');
    } catch (err) {
      this.emit('log', 'recorder-start-error', err);
      console.error('START ERROR', err);
    }
  }

  // ---------------------------------------------------------------------------
  private async startReplaysSimple() {
    try {
      const includeDefaultAudioSources = true;
      const settings = await this.createCaptureOptions({
        ...this.captureSettingsOptions,
        includeDefaultAudioSources,
      });

      settings.videoSettings.fps = 30;
      this.emit('log', 'Start replays');
      this.replaysOptions.rootFolder = path.join(kDefaultOutputPath, 'replays');
      await this.recorderApi?.startReplays(
        this.replaysOptions,
        settings.build(),
      );

      this.emit('recorder-status-changed', 'replay');
    } catch (err) {
      this.emit('log', 'START replay ERROR', err);
      return;
    }
  }

  // ---------------------------------------------------------------------------
  private async startReplaysAdvanced() {
    try {
      this.emit('log', 'Start replays');
      this.replaysOptions.rootFolder = path.join(kDefaultOutputPath, 'replays');
      await this.recorderApi?.startReplays(
        this.replaysOptions,
        this.captureSettings,
      );
      this.emit('recorder-status-changed', 'replay');
    } catch (err) {
      this.emit('log', 'START replay ERROR', err);
      return;
    }
  }

  // ---------------------------------------------------------------------------
  private generateFileNameFormat(prefix?: string, suffix?: string) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timestamp = `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
    let fileName = '';
    if (prefix) {
      fileName = `${prefix}-`;
    }
    fileName += `${fileName}${timestamp}`;
    if (suffix) {
      fileName += `${fileName}-${suffix}`;
    }

    return fileName;
  }

  // ---------------------------------------------------------------------------
  private async onGameLaunched(gameInfo: GameInfo) {
    if (!this.autoGameCapture) {
      return;
    }

    // we can't capture elevated game,
    // (window capture, or display capture is available)
    if (gameInfo.processInfo.isElevated === true) {
      return;
    }

    const alreadyActive = await this.recorderApi.isActive();
    if (alreadyActive) {
      this.emit('log', `Recording 'game-launch' already active `, gameInfo);
      return;
    }

    await this.startRecording(gameInfo);
  }

  // ---------------------------------------------------------------------------
  private onRecordingSplit(videoInfo: SplitRecordArgs) {
    console.log(videoInfo);
  }

  // ---------------------------------------------------------------------------
  private onReplayReady(replay: ReplayVideo) {
    console.log(replay);
  }

  // ---------------------------------------------------------------------------
  private onReplaysStop(record: RecordEventArgs) {
    console.log(record);
  }

  // ---------------------------------------------------------------------------
  private onReplaysStart(record: RecordEventArgs) {
    console.log(record);
  }

  // ---------------------------------------------------------------------------
  private async onGameExit(gameInfo) {
    this.emit('log', 'Recording game-exit ', JSON.stringify(gameInfo));
    this.emit('recorder-status-changed', 'stopped');
    this.stopRecording();
  }

  // ---------------------------------------------------------------------------
  private async onRecordingStats(statsInfo: RecorderStats) {
    this.emit('stats', statsInfo);
  }

  // ---------------------------------------------------------------------------
  // easy access to recorder api
  private get recorderApi(): IOverwolfRecordingApi {
    return owElectronPackages.recorder;
  }
}

