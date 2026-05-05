import { app as electronApp } from 'electron';
import { overwolf } from '@overwolf/ow-electron';
import {
  ActiveReplay,
  IOverwolfRecordingApi,
  RecordingOptions,
  CaptureSettingsOptions,
  RecordingAppOptions,
  GameInfo,
  CaptureSettings,
  CaptureReplayOptions,
  ReplayOptions,
  AudioDeviceSettingsInfo,
  CaptureSettingsBuilder,
  AudioTracks,
} from '@overwolf/ow-electron-packages-types';
import path from 'path';
import { IRecorderInformation } from '../../../common/recorder/recorder-information';
import { PackageServiceBase } from '../base.service';
import { kGameIds } from '@overwolf/ow-electron-packages-types/game-list';
import { LolGameListener } from './lol-events-listener';
import { AudioTracksEnum } from '../../../common/recorder/audio-trackes-enum';
const app = electronApp as overwolf.OverwolfApp;

/**
 * Recording service
 */
export class RecordingService extends PackageServiceBase {

  private _captureSettingsInitPromise: Promise<void>;
  private _lolGameListener: LolGameListener;

  // save the default recording/replay's options
  // so we can use it when auto game capture is on...
  // (this is not mandatory, just for this sample)
  public recordingOptions: RecordingOptions;
  public replaysOptions: ReplayOptions;
  public replayCaptureOptions: CaptureReplayOptions;

  public autoGameCapture: boolean = false;

  // saving the update (from UI) setting, used for advanced settings
  // (this is not mandatory, just for this sample)
  public captureSettings: CaptureSettings;
  public captureSettingsOptions: CaptureSettingsOptions;

  private _recorderApi: IOverwolfRecordingApi;
  private _currentGame: GameInfo | null = null;
  private _activeReplay?: ActiveReplay;
  private _displayCaptureId: string;
  private _outputFolder: string = path.join(app.getPath('videos'), app.name);
  private _replayBufferSeconds: number = 60;

  // ---------------------------------------------------------------------------
  constructor(recorderApi: IOverwolfRecordingApi) {
    super();
    this._recorderApi = recorderApi;
    this.initialize();
    this._lolGameListener = new LolGameListener(this);
    this._captureSettingsInitPromise = this.initializeCaptureSettings();
  }

  /**
   * Starts recording if eligible
   * @param gameInfo
   * @returns
   */
  public async onGameLaunched(gameInfo: GameInfo) {
    if (gameInfo.type !== 'Game') {
      return;
    }

    // Save current game info
    this._currentGame = gameInfo;

    if (this.autoGameCapture === false) {
      this.emit('log', `Auto game capture is disabled, skipping game launch for '${gameInfo.name}'`);
      return;
    }

    // we can't capture elevated game,
    // (window capture, or display capture is available)
    if (gameInfo.processInfo.isElevated === true) {
      return;
    }

    const alreadyActive = await this._recorderApi.isActive();
    if (alreadyActive === true) {
      this.emit('log', `Already recording '${gameInfo.name}'`);
      return;
    }

    // Below is an example of setting up replays for GEP supported game
    // comment out if you don't want to use GEP
    // MAKE SURE YOU SET AUTO GAME CAPTURE TO TRUE IN THE APP
    if (gameInfo.classId === kGameIds.LeagueofLegends) {
      this._lolGameListener.onGameLaunched(gameInfo.classId);
      return;
    }

    await this.startRecording();
  }

  /**
   * Stops recording if eligible
   * @param gameInfo
   */
  public async onGameExit() {

    if (this._currentGame?.classId === kGameIds.LeagueofLegends) {
      await this.onLolGameExit();
      return;
    }

    // clear current game info
    this._currentGame = null;

    if (this.recordingOptions?.autoShutdownOnGameExit === true) {
      // TODO: Forward to controller that the recorder status changed
      await this.stopRecording();
    } else {
      // TODO: Forward to controller that the `autoShoutdownOnGameExit` is
      // turned off so it should continue recording.
    }
  }

  /**
   * Called when the League of Legends game exits
   */
  public async onLolGameExit() {
    this.log('League of Legends game exited, stopping replays');

    this._currentGame = null;

    await this.stopReplays();
  }

  public async onGepEvent(event: any) {
    try {
      await this._lolGameListener.onNewEvent(event);
    } catch (error) {
      console.error('[RecordingService] - onGepEvent', error);
    }
  }

  /**
   * Called when the user clicks the start capture button
   */
  public async onStartCapture() {
    await this.startRecording();
  }

  /**
   * Called when the user clicks the stop capture button
   */
  public async onStopCapture() {
    await this.stopRecording();
  }

  /**
   * Called when the user clicks the split capture button
   */
  public async onSplitCapture() {
    await this.splitCapture();
  }

  // ---------------------------------------------------------------------------
  public async startCaptureReplay() {
    try {
      const fileName = this.generateFileNameFormat('replay-capture');

      this.replayCaptureOptions.fileName = fileName;
      this._activeReplay = await this._recorderApi.captureReplay(
        this.replayCaptureOptions,
        (video) => {
          this.log('Finished capturing replay', video);
          this.emit('recorder-status-changed', 'replay');
          this._activeReplay = undefined;
        },
      );
      this.emit('recorder-status-changed', 'replay-capture');
      this.log('Capture Replay started');
    } catch (error) {
      this.log('Error starting capture replay', error.message);
      throw error;
    }
  }

  // ---------------------------------------------------------------------------
  public async delayCapture() {
    try {
      if (!this._activeReplay) {
        await this.startCaptureReplay();
      }

      this._activeReplay?.stopAfter(10000);
    } catch (error) {
      this.log('Error delaying capture', error.message);
      throw error;
    }
  }

  // ---------------------------------------------------------------------------
  public async stopCaptureReplay() {
    try {
      this.log('Stopping capture replay');
      this._activeReplay?.stop();
    } catch (error) {
      this.log('Error stopping capture replay', error.message);
      throw error;
    }
  }

  // ---------------------------------------------------------------------------
  public async replaysTurnOn() {
    try {
      await this.startReplays();
    } catch (error) {
      this.log('Error starting replays', error.message);
      throw error;
    }
  }

  // ---------------------------------------------------------------------------
  public async stopReplays() {
    try {
      this.log('Stopping replays');
      this.emit('recorder-status-changed', 'stopped');
      await this._recorderApi.stopReplays();
    } catch (error) {
      this.log('Error stopping replays', error.message);
      throw error;
    }
  }

  /**
   * Sets the capture monitor id
   * @param displayAltId capture monitor id
   */
  public setCaptureMonitorId(displayAltId: string) {
    this.emit('log', 'Setting capture monitor id', displayAltId);
    this._displayCaptureId = displayAltId;
  }

  /**
   * Sets recording output or input devices
   */
  public async setRecordingDevices(devices: AudioDeviceSettingsInfo | AudioDeviceSettingsInfo, type: 'input' | 'output') {
    // Ensure initialization is complete
    await this.ensureCaptureSettingsInitialized();

    // Ensure captureSettings and audioSettings exist
    if (!this.captureSettings || !this.captureSettings.audioSettings) {
      const builder = await this.createCaptureOptions(this.captureSettingsOptions);
      this.captureSettings = builder.build();
    }

    this.captureSettings.audioSettings[type] = devices ? [devices] : [];

    const label = type === 'input' ? 'Input device changed' : 'Output device changed';
    this.emit('capture-settings-changed');
    this.emit(
      'log',
      label,
      this.captureSettings.audioSettings[type],
    );
  }

  // ---------------------------------------------------------------------------
  public setOutputPath(folderPath: string) {
    this._outputFolder = folderPath;
  }
  // ---------------------------------------------------------------------------
  public async queryInformation(): Promise<IRecorderInformation> {
    try {
      const settings = (
        await this.createCaptureOptions({
          separateAudioTracks: false,
          includeDefaultAudioSources: true,
        })
      ).build();

      const obsInfo = await this._recorderApi.queryInformation();

      return {
        information: obsInfo,
        recordingOptions: this.recordingOptions,
        replaysOptions: this.replaysOptions,
        captureSettings: settings,
        captureSettingsOptions: this.captureSettingsOptions,
      };
    } catch (error) {
      this.emit('error', 'Error while querying information', error);
      throw error;
    }
  }

  // ---------------------------------------------------------------------------
  public async isRecording(): Promise<boolean> {
    try {
      const isActive = await this._recorderApi.isActive();
      return isActive;
    } catch (error) {
      this.log('Error While checking Recorder status', error.message);
      return false;
    }
  }

  // ---------------------------------------------------------------------------
  public setRecordingAppOptions(options: RecordingAppOptions) {
    try {
      if (!this._recorderApi) {
        throw new Error('Recorder API not initialized');
      }

      for (const prop in options) {
        this._recorderApi.options[prop] = options[prop];
      }
    } catch (error) {
      this.log('Error setting app options', error.message);
      throw error;
    }
  }

  // ---------------------------------------------------------------------------
  public async setAudioDevices(devices: AudioDeviceSettingsInfo[]) {
    // Ensure initialization is complete
    await this.ensureCaptureSettingsInitialized();

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
      // this.emit('capture-settings-changed');
    } catch (error) {
      // this.emit('log', 'Error while setting Audio Device', error.message);
    }
  }

  //---------------------------------------------------------------------------
  private async createCaptureOptions(
    options: CaptureSettingsOptions,
  ): Promise<CaptureSettingsBuilder> {
    try {
      return this._recorderApi.createSettingsBuilder(options);
    } catch (error) {
      this.log('Error creating capture options', error.message);
      throw error;
    }
  }

  // ---------------------------------------------------------------------------
  private registerGames() {
    try {
      this._recorderApi.registerGames({
        gamesIds: [],
        all: true,
      });
    } catch (error) {
      this.emit('log', 'Error while registering games', error);
    }
  }

  // ---------------------------------------------------------------------------
  private async startRecording() {
    try {
      // Ensure initialization is complete
      await this.ensureCaptureSettingsInitialized();

      const settings = await this.buildCaptureSettings(this._currentGame);

      const fileName = this.generateFileNameFormat(
        this._currentGame ? this._currentGame.name : 'desktop',
      );

      this.recordingOptions.filePath = path.join(this._outputFolder, fileName);

      await this._recorderApi.startRecording(
        this.recordingOptions,
        settings,
        (stopResult) => {
          this.log('Recording stopped ', stopResult);
        },
      );
      this.emit('recorder-status-changed', 'recording');
      this.log('Recording started');
    } catch (error) {
      this.log('Error starting recording', error.message);
      throw error;
    }
  }

  // ---------------------------------------------------------------------------
  private async stopRecording() {
    try {
      const isRecording = await this.isRecording();
      if (isRecording === false) {
        return;
      }

      await this._recorderApi.stopRecording((stopResult) => {
        this.emit('recorder-status-changed', 'stopped');
      });
    } catch (error) {
      this.log('Error stopping recording', error.message);
      throw error;
    }
  }

  // ---------------------------------------------------------------------------
  private async startReplays() {
    try {
      // Ensure captureSettings is initialized
      await this.ensureCaptureSettingsInitialized();

      this.log('Starting replays');
      this.replaysOptions.rootFolder = path.join(this._outputFolder, 'replays');

      const settings = await this.buildCaptureSettings(this._currentGame);

      await this._recorderApi.startReplays(
        this.replaysOptions,
        settings,
      );
      this.emit('recorder-status-changed', 'replay');
    } catch (error) {
      this.log('Error starting replays', error.message);
      throw error;
    }
  }

  // ---------------------------------------------------------------------------
  /**
   * Generates a file name format with the prefix and suffix
   * @param prefix - The prefix for the file name
   * @param suffix - The suffix for the file name
   * @returns The file name with the prefix and suffix
   */
  private generateFileNameFormat(prefix?: string, suffix?: string): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timestamp = `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
    const fileName = (prefix ? `${prefix}-` : '') + timestamp + (suffix ? `-${suffix}` : '');
    return fileName;
  }

  // ---------------------------------------------------------------------------

  /**
   * Initializes the recording options and replays options synchronously
   */
  private initialize() {
    this.recordingOptions = {
      autoShutdownOnGameExit: true,
      filePath: path.join(this._outputFolder, 'dummy'),
    };

    this.replaysOptions = {
      bufferSecond: this._replayBufferSeconds,
      rootFolder: this._outputFolder,
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

    this.registerGames();
  }

  /**
   * Initializes the capture settings and returns a promise that resolves when complete
   * @private
   */
  private async initializeCaptureSettings(): Promise<void> {
    try {
      const settingsBuilder = await this.createCaptureOptions(
        this.captureSettingsOptions,
      );
      this.captureSettings = settingsBuilder.build();
    } catch (error) {
      console.error(
        '[RecordingService] - Error creating default capture settings:',
        error,
      );
      this.emit('error', 'Failed to initialize capture settings', error);
      throw error; // Re-throw so the promise rejects
    }
  }

  private async buildCaptureSettings(gameInfo: GameInfo = null): Promise<CaptureSettings> {
    try {
      const settingsBuilder: CaptureSettingsBuilder = await this.createCaptureOptions({
        ...this.captureSettingsOptions,
      });

      // Apply any custom settings from captureSettings
      if (this.captureSettings) {
        settingsBuilder.audioSettings = this.mergeAudioSettings(
          settingsBuilder.audioSettings,
          this.captureSettings.audioSettings,
        );
        settingsBuilder.audioEncoder = this.captureSettings.audioEncoder;
        settingsBuilder.videoSettings = this.captureSettings.videoSettings;
        settingsBuilder.videoEncoderSettings = this.captureSettings.videoEncoderSettings;
      }

      this.applyAudioTrackRouting(settingsBuilder);

      this.addCaptureSource(settingsBuilder, gameInfo);

      // Finalize the settings
      const finalizedSettings: CaptureSettings = settingsBuilder.build();
      return finalizedSettings;
    } catch (error) {
      this.log('Error building capture settings', error.message);
      throw error;
    }
  }


  private async splitCapture() {
    try {
      await this._recorderApi.splitRecording((split) => {
        this.log(`split capture - count: ${split.splitCount} - next file: ${split.nextFilePath}`)
      });
    } catch (error) {
      this.log('Error Splitting capture', error.message);
    }
  }
  // ---------------------------------------------------------------------------

  private applyAudioTrackRouting(settingsBuilder: CaptureSettingsBuilder) {
    if (this.captureSettingsOptions?.separateAudioTracks !== true) {
      return;
    }

    if (this.captureSettingsOptions?.includeDefaultAudioSources !== true) {
      return;
    }

    const audioSettings = settingsBuilder.audioSettings;
    if (!audioSettings) {
      return;
    }

    audioSettings.inputs = this.assignTracks(
      audioSettings.inputs,
      (AudioTracksEnum.Track1 | AudioTracksEnum.Track3) as AudioTracks,
    );
    audioSettings.outputs = this.assignTracks(
      audioSettings.outputs,
      (AudioTracksEnum.Track1 | AudioTracksEnum.Track2) as AudioTracks,
    );
    audioSettings.applications = this.assignTracks(
      audioSettings.applications,
      (AudioTracksEnum.Track1 | AudioTracksEnum.Track2) as AudioTracks,
    );

    const usedTracks = this.collectUsedAudioTracks(audioSettings);
    if (usedTracks !== undefined) {
      this.recordingOptions.audioTrack = usedTracks;
      this.replaysOptions.audioTrack = usedTracks;
    }
  }

  private mergeAudioSettings(
    builderAudioSettings: CaptureSettings['audioSettings'],
    customAudioSettings: CaptureSettings['audioSettings'],
  ): CaptureSettings['audioSettings'] {
    if (!builderAudioSettings) {
      return customAudioSettings;
    }

    if (!customAudioSettings) {
      return builderAudioSettings;
    }

    const useDefaultAudioSources =
      this.captureSettingsOptions?.includeDefaultAudioSources !== false;

    return {
      ...builderAudioSettings,
      ...customAudioSettings,
      inputs: useDefaultAudioSources
        ? builderAudioSettings.inputs
        : (customAudioSettings.inputs ?? builderAudioSettings.inputs),
      outputs: useDefaultAudioSources
        ? builderAudioSettings.outputs
        : (customAudioSettings.outputs ?? builderAudioSettings.outputs),
      applications:
        customAudioSettings.applications ?? builderAudioSettings.applications,
    };
  }

  private assignTracks<T extends AudioDeviceSettingsInfo>(
    devices: T[] | undefined,
    trackMask: AudioTracks,
  ): T[] {
    return (
      devices?.map((device) => ({
        ...device,
        tracks: trackMask,
      })) ?? []
    );
  }

  private collectUsedAudioTracks(
    audioSettings: CaptureSettings['audioSettings'],
  ): AudioTracks | undefined {
    const devices = [
      ...(audioSettings?.inputs ?? []),
      ...(audioSettings?.outputs ?? []),
      ...(audioSettings?.applications ?? []),
    ];

    if (devices.length === 0) {
      return undefined;
    }

    return devices.reduce<AudioTracks>(
      (mask, device) => ((mask ?? 0) | (device.tracks ?? AudioTracksEnum.Track1)) as AudioTracks,
      0 as AudioTracks,
    );
  }

  /**
   * Adds the appropriate capture source(s) to the settings builder based on the provided game information.
   * If a game is specified, adds a game source and, if the game uses Out-Of-Process Overlays (OOPO), also adds a screen source.
   * If no game is specified, adds a screen source for desktop capture.
   * @param settings The CaptureSettingsBuilder to which sources will be added.
   * @param gameInfo The GameInfo object containing details about the game to capture, or null for desktop capture.
   */
  private addCaptureSource(
    settings: CaptureSettingsBuilder,
    gameInfo: GameInfo,
  ) {
    if (gameInfo) {
      try {
        // game capture
        settings.addGameSource({
          gameProcess: gameInfo.processInfo.pid, // or just 'Game.exe' name
          captureOverlays: true, //
        });
      } catch (error) {
        console.error('Error adding game source', error);
      }

      // The 'OOPO' flag is assumed to indicate that the game uses Out-Of-Process Overlays (OOPO).
      // When this flag is true, screen capture is also required in addition to game capture.
      if (gameInfo.flags?.OOPO === true) {
        // if the game is OOPO, we need to add the screen source as well
        try {
          if (this._displayCaptureId) {
            settings.addScreenSource({ monitorId: this._displayCaptureId });
          } else {
            console.error('No display capture id set');
          }
        } catch (error) {
          console.error('Error adding screen source', error);
        }
      }
    } else {
      // desktop capture
      try {
        if (this._displayCaptureId) {
          settings.addScreenSource({ monitorId: this._displayCaptureId });
        } else {
          console.error('No display capture id set');
        }
      } catch (error) {
        console.error('Error adding screen source', error);
      }
    }
  }

  /**
 * Ensures capture settings are initialized before proceeding
 * @private
 */
  private async ensureCaptureSettingsInitialized(): Promise<void> {
    try {
      await this._captureSettingsInitPromise;
    } catch (error) {
      this.log('Error ensuring capture settings initialized', error.message);
      throw error;
    }
  }
}
