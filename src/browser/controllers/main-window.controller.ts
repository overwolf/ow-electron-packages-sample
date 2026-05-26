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
  private selectedDisplayId: number | null = null;

  private get settingsFilePath(): string {
    return path.join(electronApp.getPath('userData'), 'window-settings.json');
  }

  private loadDisplaySettings(): void {
    try {
      if (fs.existsSync(this.settingsFilePath)) {
        const data = JSON.parse(fs.readFileSync(this.settingsFilePath, 'utf-8'));
        this.selectedDisplayId = typeof data.selectedDisplayId === 'number'
          ? data.selectedDisplayId
          : null;
      }
    } catch {
      this.selectedDisplayId = null;
    }
  }

  private saveDisplaySettings(): void {
    try {
      fs.writeFileSync(
        this.settingsFilePath,
        JSON.stringify({ selectedDisplayId: this.selectedDisplayId }),
        'utf-8',
      );
    } catch (error) {
      console.error('Failed to save display settings:', error);
    }
  }

  private resolveTargetDisplay(): Electron.Display {
    const all = screen.getAllDisplays();
    const primary = screen.getPrimaryDisplay();
    if (this.selectedDisplayId !== null) {
      const saved = all.find((d) => d.id === this.selectedDisplayId);
      if (saved) return saved;
      this.selectedDisplayId = null;
      this.saveDisplaySettings();
    }
    return primary;
  }

  // Base window size was designed for a 1920×1080 physical screen.
  private static readonly REF_PHYSICAL_WIDTH = 1920;
  private static readonly REF_PHYSICAL_HEIGHT = 1080;
  private static readonly BASE_WIDTH = 1504;
  private static readonly BASE_HEIGHT = 972;

  private calculateWindowSize(display: Electron.Display): { width: number; height: number } {
    const { workArea, scaleFactor } = display;

    // Use physical pixel dimensions so the window occupies the same screen
    // fraction on every monitor regardless of its DPI scale setting.
    const physW = workArea.width * scaleFactor;
    const physH = workArea.height * scaleFactor;

    const ratio = Math.min(
      physW / MainWindowController.REF_PHYSICAL_WIDTH,
      physH / MainWindowController.REF_PHYSICAL_HEIGHT,
    );

    // Scale base physical size, then convert back to logical pixels for this display.
    let width  = Math.round((MainWindowController.BASE_WIDTH  * ratio) / scaleFactor);
    let height = Math.round((MainWindowController.BASE_HEIGHT * ratio) / scaleFactor);

    // Never overflow the work area (4% breathing room).
    width  = Math.min(width,  Math.floor(workArea.width  * 0.96));
    height = Math.min(height, Math.floor(workArea.height * 0.96));

    return { width: Math.max(width, 800), height: Math.max(height, 600) };
  }

  private moveWindowToDisplay(display: Electron.Display): void {
    if (!this.browserWindow || this.browserWindow.isDestroyed()) return;

    // Maximized windows ignore setBounds — unmaximize first.
    if (this.browserWindow.isMaximized()) {
      this.browserWindow.unmaximize();
    }

    const { width, height } = this.calculateWindowSize(display);
    const { x, y, width: wa, height: wah } = display.workArea;
    const cx = Math.round(x + (wa - width) / 2);
    const cy = Math.round(y + (wah - height) / 2);

    // Step 1: move a single point onto the target display so Windows switches
    // the window's per-monitor DPI context to the target monitor.
    this.browserWindow.setPosition(Math.round(x + wa / 2), Math.round(y + wah / 2));

    // Step 2: now that the DPI context matches the target display, apply the
    // correct size and final centered position.
    this.browserWindow.setBounds({ x: cx, y: cy, width, height });
  }

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

  private onGameScreenDetected(gameDisplay: Electron.Display): void {
    if (!this.browserWindow || this.browserWindow.isDestroyed()) return;

    const allDisplays = screen.getAllDisplays();
    if (allDisplays.length <= 1) return;

    // Find which display the app window currently sits on
    const { x, y, width, height } = this.browserWindow.getBounds();
    const appDisplay = screen.getDisplayNearestPoint({
      x: Math.round(x + width / 2),
      y: Math.round(y + height / 2),
    });

    // Already on a different screen — nothing to do
    if (appDisplay.id !== gameDisplay.id) return;

    // Pick the first available display that isn't the game's
    const alternative = allDisplays.find((d) => d.id !== gameDisplay.id);
    if (!alternative) return;

    this.printLogMessage(
      `[display] Game launched on display ${gameDisplay.id} — moving app to display ${alternative.id}`,
    );

    // Move without touching selectedDisplayId so the user's saved preference
    // is preserved and restored when the game exits.
    this.moveWindowToDisplay(alternative);
  }

  private onGameExit(): void {
    if (!this.browserWindow || this.browserWindow.isDestroyed()) return;
    // Restore to user's preferred display (or primary if none saved)
    const target = this.resolveTargetDisplay();
    this.moveWindowToDisplay(target);
    this.printLogMessage(`[display] Game exited — restored app to display ${target.id}`);
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
    this.loadDisplaySettings();
    const target = this.resolveTargetDisplay();
    const { width: desiredWidth, height: desiredHeight } = this.calculateWindowSize(target);
    const shouldFullscreen = target.workArea.width < desiredWidth;

    this.browserWindow = new BrowserWindow({
      width: desiredWidth,
      height: desiredHeight,
      x: Math.round(target.workArea.x + (target.workArea.width - desiredWidth) / 2),
      y: Math.round(target.workArea.y + (target.workArea.height - desiredHeight) / 2),
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

    //----------------------------------------------------------------------------
    ipcMain.handle('get-displays', () => {
      const primaryDisplay = screen.getPrimaryDisplay();
      const displays = screen.getAllDisplays().map((display, index) => ({
        id: display.id,
        label: display.label || `Display ${index + 1}`,
        width: display.bounds.width,
        height: display.bounds.height,
        scaleFactor: display.scaleFactor,
        isPrimary: display.id === primaryDisplay.id,
        x: display.bounds.x,
        y: display.bounds.y,
        displayFrequency: display.displayFrequency,
      }));
      return { displays, selectedDisplayId: this.selectedDisplayId };
    });
    //----------------------------------------------------------------------------

    //----------------------------------------------------------------------------
    ipcMain.handle('set-window-display', (_, displayId: number) => {
      const display = screen.getAllDisplays().find((d) => d.id === displayId);
      if (!display) return false;
      this.selectedDisplayId = displayId;
      this.saveDisplaySettings();
      this.moveWindowToDisplay(display);
      return true;
    });
    //----------------------------------------------------------------------------
  }

  private registerListeners() {
    this.gepController.on('log', this.printLogMessage.bind(this));
    this.gepController.on('gep-info', this.gepOnInfo.bind(this));
    this.gepController.on('gep-event', this.gepOnEvent.bind(this));

    this.overlayController.on('log', this.printLogMessage.bind(this));
    this.overlayController.on('game-exit', this.gepOnExit.bind(this));
    this.overlayController.on('game-exit', this.onGameExit.bind(this));
    this.overlayController.on('game-screen-detected', this.onGameScreenDetected.bind(this));
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
