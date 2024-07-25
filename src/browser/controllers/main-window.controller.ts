import { app as electronApp, ipcMain, BrowserWindow, dialog } from 'electron';
import { GameEventsService } from '../services/gep.service';
import path from 'path';
import { DemoOSRWindowController } from './demo-osr-window.controller';
import { OverlayService } from '../services/overlay.service';
import { overwolf } from '@overwolf/ow-electron';
import { OverlayHotkeysService } from '../services/overlay-hotkeys.service';
import { OverlayInputService } from '../services/overlay-input.service';
import {
  RecordingService,
} from '../services/recording.service';
import { RecordingStatus } from '../../common/recorder/recording-status';
import { GameInfo, RecorderStats } from '@overwolf/ow-electron-packages-types';
import { exec } from 'child_process';
import { LolGameListener } from './lol-events-listener';

const owElectronApp = electronApp as overwolf.OverwolfApp;

/**
 *
 */
export class MainWindowController {
  private browserWindow: BrowserWindow = null;

  /**
   *
   */
  constructor(
    private readonly gepService: GameEventsService,
    private readonly overlayService: OverlayService,
    private readonly createDemoOsrWinController: () => DemoOSRWindowController,
    private readonly overlayHotkeysService: OverlayHotkeysService,
    private readonly overlayInputService: OverlayInputService,
    private readonly recordingService: RecordingService,
    private readonly lolListener: LolGameListener,
  ) {
    this.registerToIpc();
    this.registerListeners();
  }

  /**
   *
   */
  public printLogMessage(message: String, ...args: any[]) {
    if (this.browserWindow?.isDestroyed() ?? true) {
      return;
    }

    this.browserWindow?.webContents?.send('console-message', message, ...args);
  }

  private gepOnInfo(message: string, ...args: any[]) {
    this.lolListener.onNewInfo(args[1]);
  }

  private gepOnEvent(message: string, ...args: any[]) {
    this.lolListener.onNewEvent(args[1]);
  }

  private gepOnLaunch(gameId: number) {
    this.lolListener.onGameLaunched(gameId);
  }

  private gepOnExit(info: GameInfo) {
    this.lolListener.onGameExit(info.classId);
  }

  private onRecorderStatusChanged(status: RecordingStatus) {
    this.browserWindow?.webContents?.send('recording-status-changed', status);
  }

  private onCaptureSettingsChanged() {
    if (this.browserWindow?.isDestroyed() ?? true) {
      return;
    }

    this.browserWindow?.webContents?.send(
      'capture-settings-changed',
      this.recordingService?.captureSettings,
    );
  }

  private onRecordingStats(statsInfo: RecorderStats) {
    if (this.browserWindow?.isDestroyed() ?? true) {
      return;
    }

    this.browserWindow?.webContents?.send('recording-stats', statsInfo);
  }

  /**
   *
   */
  public createAndShow(showDevTools: boolean) {
    this.browserWindow = new BrowserWindow({
      width: 900,
      height: 900,
      show: true,
      webPreferences: {
        // NOTE: nodeIntegration and contextIsolation are only required for this
        // specific demo app, they are not a neceassry requirement for any other
        // ow-electron applications
        nodeIntegration: true,
        contextIsolation: true,
        devTools: showDevTools,
        // relative to root folder of the project
        preload: path.join(__dirname, '../preload/preload.js'),
      },
    });

    this.browserWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  /**
   *
   */
  private async registerToIpc() {
    ipcMain.handle('createOSR', async () => await this.createOSRDemoWindow());

    ipcMain.handle('open-folder-picker', async () => {
      return dialog.showOpenDialog({
        properties: ['openDirectory'],
      });
    });

    ipcMain.handle('open-folder', (...args) => {
      try {
        if (!args[1]) {
          return false;
        }

        exec(`explorer.exe ${args[1]}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error: ${error.message}`);
            return;
          }

          if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
          }
        });
        return true;
      } catch {
        return false;
      }
    });
  }

  private registerListeners() {
    this.gepService.on('log', this.printLogMessage.bind(this));
    this.gepService.on('gep-info', this.gepOnInfo.bind(this));
    this.gepService.on('gep-event', this.gepOnEvent.bind(this));
    this.gepService.on('game-launch', this.gepOnLaunch.bind(this));
    this.overlayService.on('log', this.printLogMessage.bind(this));
    this.overlayService.on('game-exit', this.gepOnExit.bind(this));
    this.overlayHotkeysService.on('log', this.printLogMessage.bind(this));
    this.recordingService.on('log', this.printLogMessage.bind(this));
    this.recordingService.on('stats', this.onRecordingStats.bind(this));
    this.recordingService.on(
      'capture-settings-changed',
      this.onCaptureSettingsChanged.bind(this),
    );

    this.recordingService.on(
      'recorder-status-changed',
      this.onRecorderStatusChanged.bind(this),
    );

    owElectronApp.overwolf.packages.on('crashed', (e, ...args) => {
      this.printLogMessage('package crashed', ...args);
    });

    owElectronApp.overwolf.packages.on(
      'failed-to-initialize',
      this.logPackageManagerErrors.bind(this),
    );
  }

  /**
   *
   */
  private logPackageManagerErrors(e, packageName, ...args: any[]) {
    this.printLogMessage(
      'Overwolf Package Manager error!',
      packageName,
      ...args,
    );
  }

  /**
   *
   */
  private async createOSRDemoWindow(): Promise<void> {
    const controller = this.createDemoOsrWinController();

    const showDevTools = true;
    await controller.createAndShow(showDevTools);

    controller.overlayBrowserWindow.window.on('closed', () => {
      this.printLogMessage('osr window closed');
    });
  }
}

