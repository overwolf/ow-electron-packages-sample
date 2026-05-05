import {
  app as electronApp,
  ipcMain,
  BrowserWindow,
  dialog,
  screen,
} from 'electron';
import path from 'path';
import { overwolf } from '@overwolf/ow-electron';
import { RecordingController } from './recorder/recording.controller';
import { RecordingStatus } from '../../common/recorder/recording-status';
import { GameInfo, RecorderStats } from '@overwolf/ow-electron-packages-types';
import { exec } from 'child_process';
import { UtilityService } from '../services/utility.service';
import { UpdaterService } from '../services/updater.service';
import { OverlayController } from './overlay/overlay.controller';
import { GameEventsController } from './gep/game-events.controller';
import { IRecorderInformation } from '../../common/recorder/recorder-information';
import fs from 'fs';
import { kGameIds } from '@overwolf/ow-electron-packages-types/game-list';

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
    private readonly gepController: GameEventsController,
    private readonly overlayController: OverlayController,
    private readonly utilityService: UtilityService,
    private readonly recordingController: RecordingController,
    // private readonly lolListener: LolGameListener,
    private readonly appUpdater: UpdaterService = new UpdaterService(),
  ) {
    this.registerToIpc();
    this.registerListeners();
  }

  /**
   * Prints a log message to the main window's renderer.
   */
  public printLogMessage(message: String, ...args: any[]) {
    if (this.browserWindow?.isDestroyed()) return;

    this.browserWindow?.webContents?.send('console-message', {
      message,
      args,
    });
  }

  private gepOnInfo(payload: { gameId: number; data: any }) {
    this.overlayController.sendGepInfoToWindows(payload);
  }

  private gepOnEvent(payload: { gameId: number; data: any }) {
    this.overlayController.sendGepEventToWindows(payload);

    if (payload.gameId === kGameIds.LeagueofLegends) {
      this.recordingController.onGepEvent(payload);
    }
  }

  private gepOnLaunch(gameId: number) {
    // this.lolListener.onGameLaunched(gameId);
  }

  private gepOnExit(info: GameInfo) {
    // this.lolListener.onGameExit(info.classId);
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
      this.recordingController?.captureSettings,
    );
  }

  private onRecordingStats(statsInfo: RecorderStats) {
    if (this.browserWindow?.isDestroyed() ?? true) {
      return;
    }

    this.browserWindow?.webContents?.send('recording-stats', statsInfo);
  }

  private onRecorderInfo(info: IRecorderInformation) {
    if (this.browserWindow?.isDestroyed() ?? true) {
      return;
    }

    this.browserWindow?.webContents?.send('recorder-info', info);
  }

  /**
   *
   */
  public createAndShow(showDevTools: boolean) {
    const desiredWidth = 1504,
      desiredHeight = 972,
      primaryDisplay = screen.getPrimaryDisplay(),
      screenWidth = primaryDisplay.workArea.width,
      shouldFullscreen = screenWidth < desiredWidth;

    this.browserWindow = new BrowserWindow({
      width: desiredWidth,
      height: desiredHeight,
      show: true,
      frame: false,
      fullscreenable: false,
      resizable: true,
      maximizable: true,
      fullscreen: shouldFullscreen,
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
   * Registers IPC handlers for communication between the main and renderer processes.
   */
  private async registerToIpc() {
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

    ipcMain.handle('disable-ads-fpd', () => {
      owElectronApp.overwolf.disableAdsFPD();
    });

    ipcMain.handle('has-pending-updates', () => {
      const hasPendingUpdates =
        owElectronApp.overwolf.packages.hasPendingUpdates();

      this.printLogMessage(
        '*** [hasPendingUpdates] result: ',
        hasPendingUpdates,
        '***',
      );
    });

    ipcMain.handle('manage-cmp', async () => {

      //------------------ QA ------------------
      const result = await owElectronApp.overwolf.isCMPRequired();
      console.log(result);
      //------------------ QA ------------------

      await owElectronApp.overwolf.openCMPWindow({
        modal: true,
        language: 'en',
        parent: null,
      });
    });

    ipcMain.handle('is-cmp-required', () => {
      // need to store and return as an alert or something
      return owElectronApp.overwolf.isCMPRequired();
    });

    //----------------------------------------------------------------------------
    ipcMain.handle('generate-email-hashes', (event, email: string) => {
      if (!email) {
        console.error('[ERROR] - Email is required to generate hashes');
        return;
      }
      return owElectronApp.overwolf.generateUserEmailHashes(email);
    });
    //----------------------------------------------------------------------------
    ipcMain.handle(
      'set-email-hashes',
      (event, hashes: overwolf.EmailHashes) => {
        if (!hashes) {
          console.error('[ERROR] - hashes are required to set');
          return;
        }
        return owElectronApp.overwolf.setUserEmailHashes(hashes);
      },
    );
    //----------------------------------------------------------------------------

    //----------------------------------------------------------------------------
    ipcMain.handle('check-for-updates', async () => {
      try {
        await this.appUpdater.checkForUpdatesAndNotify();
      } catch (error) {
        console.error('Failed to check for updates:', error);
      }
    });
    //----------------------------------------------------------------------------

    ipcMain.handle('maximize', () => {
      this.browserWindow.maximize();
    });

    ipcMain.handle('unmaximize', () => {
      this.browserWindow.unmaximize();
    });

    ipcMain.handle('close', () => {
      this.browserWindow.close();
    });

    ipcMain.handle('minimize', () => {
      this.browserWindow.minimize();
    });

    //----------------------------------------------------------------------------
    // Get available packages from package.json for settings disabled state
    ipcMain.handle('get-available-packages', () => {
      try {
        const packageJsonPath = path.join(process.cwd(), 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        return packageJson.overwolf?.packages || [];
      } catch (error) {
        console.error('Failed to read package.json:', error);
        return [];
      }
    });
    //----------------------------------------------------------------------------
  }

  private registerListeners() {
    this.gepController.on('log', this.printLogMessage.bind(this));
    this.gepController.on('gep-info', this.gepOnInfo.bind(this));
    this.gepController.on('gep-event', this.gepOnEvent.bind(this));

    this.overlayController.on('log', this.printLogMessage.bind(this));
    this.overlayController.on('game-exit', this.gepOnExit.bind(this));
    this.overlayController.on('show-hide-desktop-window', () => {
      this.handleShowHideDesktopWindow();
    });
    this.overlayController.on('start-stop-recording', () => {
      this.recordingController.captureFromHotkey();
    });

    this.utilityService.on('log', this.printLogMessage.bind(this));

    this.recordingController.on('log', this.printLogMessage.bind(this));
    this.recordingController.on('stats', this.onRecordingStats.bind(this));
    this.recordingController.on(
      'recorder-info',
      this.onRecorderInfo.bind(this),
    );
    this.recordingController.on(
      'capture-settings-changed',
      this.onCaptureSettingsChanged.bind(this),
    );
    this.recordingController.on(
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

    owElectronApp.overwolf.packages.on('package-update-pending', () => {
      const pendingUpdateResult =
        owElectronApp.overwolf.packages.hasPendingUpdates();
      this.printLogMessage('*** update pending ***', pendingUpdateResult);
    });
  }
  //----------------------------------------------------------------------------
  private logPackageManagerErrors(e, packageName, ...args: any[]) {
    this.printLogMessage(
      'Overwolf Package Manager error!',
      packageName,
      ...args,
    );
  }
  //----------------------------------------------------------------------------
  private handleShowHideDesktopWindow() {
    this.printLogMessage('show-hide-desktop-window hotkey pressed');

    let visibility = this.browserWindow.isVisible();

    if (visibility === true) {
      this.browserWindow.minimize();
    } else {
      this.browserWindow.restore();

      // We're calling show to make sure the window is brought to front
      this.browserWindow.show();
    }
  }
}
