import {
  app as electronApp,
  ipcMain,
  BrowserWindow,
  dialog,
  screen,
} from 'electron';
import path from 'path';
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
import { OverlayChannels, PackageChannelIpcChannels } from '../../common/channels/channels';
/**
 *
 */
export class MainWindowController {
  private browserWindow: BrowserWindow | null = null;
  private packageVersions: Record<string, string> = {};
  private packageInitFailures: Record<string, string> = {};

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
   * Reads the package names this app is registered for from package.json (overwolf.packages).
   */
  private getConfiguredPackages(): string[] {
    try {
      const packageJsonPath = path.join(electronApp.getAppPath(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      return packageJson.overwolf?.packages || [];
    } catch (error) {
      console.error('Failed to read package.json:', error);
      return [];
    }
  }

  /**
   * Prints a log message to the main window's renderer.
   * Accepts either a plain string (direct calls) or a { message, type } object (from 'log' events).
   */
  public printLogMessage(payload: string | { message: string; type: string; args?: any[] }, ...rest: any[]) {
    if (this.browserWindow?.isDestroyed()) return;

    const message = typeof payload === 'string' ? payload : payload.message;
    const type = typeof payload === 'string' ? 'info' : payload.type;
    const args = typeof payload === 'string' ? rest : (payload.args ?? []);

    this.browserWindow?.webContents?.send('console-message', {
      message,
      type,
      args,
    });
  }

  private gepOnInfo(payload: { gameId: number; data: any }) {
    this.overlayController.sendGepInfoToWindows(payload);
  }

  private gepOnEvent(payload: { gameId: number; data: any }) {
    this.overlayController.sendGepEventToWindows(payload);

    if (
      payload.gameId === kGameIds.LeagueofLegends ||
      payload.gameId === kGameIds.Dota2
    ) {
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

  private get displayPrefsPath(): string {
    return path.join(electronApp.getPath('userData'), 'display-prefs.json');
  }

  private get screenshotPrefsPath(): string {
    return path.join(electronApp.getPath('userData'), 'screenshot-prefs.json');
  }

  private loadScreenshotFormat(): 'jpg' | 'bmp' {
    try {
      const prefs = JSON.parse(fs.readFileSync(this.screenshotPrefsPath, 'utf-8'));
      return prefs.format === 'bmp' ? 'bmp' : 'jpg';
    } catch {
      return 'jpg';
    }
  }

  private saveScreenshotFormat(format: 'jpg' | 'bmp') {
    try {
      fs.writeFileSync(this.screenshotPrefsPath, JSON.stringify({ format }), 'utf-8');
    } catch (e) {
      console.error('[MainWindow] Failed to save screenshot prefs', e);
    }
  }

  private loadDisplayPrefs(): { preferredDisplayId?: number } {
    try {
      return JSON.parse(fs.readFileSync(this.displayPrefsPath, 'utf-8'));
    } catch {
      return {};
    }
  }

  private saveDisplayPrefs(prefs: { preferredDisplayId?: number }) {
    try {
      fs.writeFileSync(this.displayPrefsPath, JSON.stringify(prefs), 'utf-8');
    } catch (e) {
      console.error('[MainWindow] Failed to save display prefs', e);
    }
  }

  private getTargetDisplay(): Electron.Display {
    const displays = screen.getAllDisplays();
    if (displays.length === 1) return displays[0];

    const prefs = this.loadDisplayPrefs();
    if (prefs.preferredDisplayId !== undefined) {
      const saved = displays.find(d => d.id === prefs.preferredDisplayId);
      if (saved) return saved;
    }

    // Default: prefer the non-primary display so the app doesn't overlay the game
    const primary = screen.getPrimaryDisplay();
    return displays.find(d => d.id !== primary.id) ?? primary;
  }

  /**
   *
   */
  public createAndShow(showDevTools: boolean) {
    const desiredWidth = 1280,
      desiredHeight = 800;

    const targetDisplay = this.getTargetDisplay();
    const { x, y, width } = targetDisplay.workArea;
    const shouldFullscreen = width < desiredWidth;

    this.browserWindow = new BrowserWindow({
      width: desiredWidth,
      height: desiredHeight,
      x,
      y,
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


    this.browserWindow.webContents.once('did-finish-load', () => {  
      this.onWindowReady();
    });
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
      electronApp.overwolf.disableAdsFPD();
    });
    
    ipcMain.handle('has-pending-updates', () => {
      const hasPendingUpdates =
        electronApp.overwolf.packages.hasPendingUpdates();

      this.printLogMessage(
        '*** [hasPendingUpdates] result: ',
        hasPendingUpdates,
        '***',
      );
    });

    ipcMain.handle('manage-cmp', async () => {
      //------------------ QA ------------------
      const result = await electronApp.overwolf.isCMPRequired();
      console.log(result);
      //------------------ QA ------------------

      await electronApp.overwolf.openCMPWindow({
        modal: true,
        language: 'en',
        parent: undefined,
      });
    });

    ipcMain.handle('is-cmp-required', () => {
      // need to store and return as an alert or something
      return electronApp.overwolf.isCMPRequired();
    });

    //----------------------------------------------------------------------------
    ipcMain.handle('generate-email-hashes', (event, email: string) => {
      if (!email) {
        console.error('[ERROR] - Email is required to generate hashes');
        return;
      }
      return electronApp.overwolf.generateUserEmailHashes(email);
    });
    //----------------------------------------------------------------------------
    ipcMain.handle(
      'set-email-hashes',
      (event, hashes: overwolf.EmailHashes) => {
        if (!hashes) {
          console.error('[ERROR] - hashes are required to set');
          return;
        }
        return electronApp.overwolf.setUserEmailHashes(hashes);
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
      this.browserWindow?.maximize();
    });

    ipcMain.handle('unmaximize', () => {
      this.browserWindow?.unmaximize();
    });

    ipcMain.handle('close', () => {
      this.browserWindow?.close();
    });

    ipcMain.handle('minimize', () => {
      this.browserWindow?.minimize();
    });

    ipcMain.handle('get-displays', async () => {
      const currentBounds = this.browserWindow?.getBounds();
      const centerX = currentBounds ? currentBounds.x + currentBounds.width / 2 : 0;
      const centerY = currentBounds ? currentBounds.y + currentBounds.height / 2 : 0;

      const displays = [...screen.getAllDisplays()].sort((a, b) =>
        a.bounds.x !== b.bounds.x ? a.bounds.x - b.bounds.x : a.bounds.y - b.bounds.y,
      );
      const primary = screen.getPrimaryDisplay();
      const currentDisplay = currentBounds
        ? screen.getDisplayNearestPoint({ x: centerX, y: centerY })
        : primary;

      // Try to enrich display labels with Overwolf friendly names.
      // Match by physical origin: Overwolf rect is in physical px, Electron bounds in logical px.
      const owMonitors = await this.recordingController.queryMonitors();

      return displays.map((d, i) => {
        const owMatch = owMonitors?.find(m =>
          Math.abs(m.rect.left - Math.round(d.bounds.x * d.scaleFactor)) < 50 &&
          Math.abs(m.rect.top  - Math.round(d.bounds.y * d.scaleFactor)) < 50,
        );
        const isPrimary = d.id === primary.id;
        const label = owMatch?.friendlyName
          ? `${owMatch.friendlyName}${isPrimary ? ' (Primary)' : ''}`
          : `Display ${i + 1}${isPrimary ? ' (Primary)' : ''}`;
        return {
          id: d.id,
          label,
          isCurrent: d.id === currentDisplay.id,
        };
      });
    });

    ipcMain.handle('get-screenshot-format', () => {
      return this.loadScreenshotFormat();
    });

    ipcMain.handle('set-screenshot-format', (_e, format: 'jpg' | 'bmp') => {
      this.saveScreenshotFormat(format);
    });

    ipcMain.handle('move-to-display', async (_e, displayId: number) => {
      if (!this.browserWindow) return false;

      const target = screen.getAllDisplays().find(d => d.id === displayId);
      if (!target) return false;

      return this.moveWindowToDisplay(target);
    });

    //----------------------------------------------------------------------------
    // Get available packages from package.json for settings disabled state
    ipcMain.handle('get-utm-params', () => {
      try {
        const uid = electronApp.overwolf?.uid;
        const owJsonPath = path.join(electronApp.getPath('appData'), 'ow-electron', uid, 'ow-electron.json');
        const owJson = JSON.parse(fs.readFileSync(owJsonPath, 'utf-8'));
        return owJson.utmParams ?? null;
      } catch (e) {
        this.printLogMessage('[get-utm-params] error: ' + e);
        return null;
      }
    });

    ipcMain.handle('get-available-packages', () => {
      return this.getConfiguredPackages();
    });
    //----------------------------------------------------------------------------

    //----------------------------------------------------------------------------
    // Package dev channels
    ipcMain.handle(PackageChannelIpcChannels.GET_VERSIONS, () => {
      const versions: Record<string, string> = { ...this.packageVersions };
      this.getConfiguredPackages().forEach(name => {
        if (!versions[name]) {
          const v = (electronApp.overwolf.packages as any)[name]?.version;
          if (v) versions[name] = v;
        }
      });
      return versions;
    });

    ipcMain.handle(PackageChannelIpcChannels.GET_INIT_FAILURES, () => {
      return { ...this.packageInitFailures };
    });

    ipcMain.handle(PackageChannelIpcChannels.GET_AVAILABLE, async () => {
      try {
        return await electronApp.overwolf.packages.getAvailableChannels();
      } catch (err) {
        console.error('[pkg-channels] getAvailableChannels error:', err);
        return {};
      }
    });

    ipcMain.handle(PackageChannelIpcChannels.GET_CURRENT, async () => {
      try {
        return await electronApp.overwolf.packages.getChannel();
      } catch (err) {
        console.error('[pkg-channels] getChannel error:', err);
        return {};
      }
    });

    ipcMain.handle(PackageChannelIpcChannels.SET, async (_e, packageName: string, channel?: string) => {
      try {
        return await electronApp.overwolf.packages.setChannel(
          packageName,
          channel,
          (pkgInfo: { name: string; version: string }) => {
            this.browserWindow?.webContents?.send(PackageChannelIpcChannels.READY, pkgInfo);
          },
        );
      } catch (err) {
        console.error('[pkg-channels] setChannel error:', err);
        return { success: false, error: String(err) };
      }
    });

    ipcMain.handle(PackageChannelIpcChannels.RELAUNCH, () => {
      electronApp.relaunch();
      electronApp.exit(0);
    });

    ipcMain.handle(PackageChannelIpcChannels.GET_LOGS_FOLDER, () => {
      try {
        return (electronApp.overwolf.packages).logsFolderPath ?? null;
      } catch (err) {
        console.error('[pkg-channels] logsFolderPath error:', err);
        return null;
      }
    });
    //----------------------------------------------------------------------------
  }

  private onWindowReady() {  
    this.printLogMessage(`app uid: ${electronApp.overwolf?.uid}`);
    this.printLogMessage(`app muid: ${electronApp.overwolf?.muid}`);
    this.printLogMessage(`app phase percent: ${electronApp.overwolf?.phasePercent}`);
  }

  private registerListeners() {
    this.gepController.on('log', this.printLogMessage.bind(this));
    this.gepController.on('gep-info', this.gepOnInfo.bind(this));
    this.gepController.on('gep-event', this.gepOnEvent.bind(this));

    this.overlayController.on('log', this.printLogMessage.bind(this));
    this.overlayController.on('game-exit', this.gepOnExit.bind(this));
    this.overlayController.on('game-on-screen', (gameDisplay: Electron.Display | null) => {
      this.moveWindowAwayFromGame(gameDisplay);
    });
    this.overlayController.on('show-hide-desktop-window', () => {
      this.handleShowHideDesktopWindow();
    });
    this.overlayController.on(OverlayChannels.ELEVATION_HELPER_PROMPT, (gameName: string) => {
      this.browserWindow?.webContents?.send(OverlayChannels.ELEVATION_HELPER_PROMPT, gameName);
    });
    this.overlayController.on('start-stop-recording', () => {
      this.recordingController.captureFromHotkey();
    });
    this.overlayController.on('take-screenshot', () => {
      void this.captureScreenshotFromHotkey();
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
    this.recordingController.on('capture-output-started', () => {
      this.browserWindow?.webContents?.send('capture-output-started');
    });

    this.getConfiguredPackages().forEach(pkgName => {
      const pkg = (electronApp.overwolf.packages as any)[pkgName];
      if (!pkg) return;
      if (pkg.version) {
        this.packageVersions[pkgName] = pkg.version;
      }
      pkg.on?.('ready', (version: string) => {
        this.packageVersions[pkgName] = version ?? pkg.version;
      });
    });

    electronApp.overwolf.packages.on('crashed', (e: Event, canRecover: boolean) => {
      this.printLogMessage('package crashed', 'canRecover:', canRecover);
      // e.preventDefault(); // uncomment to suppress the automatic relaunch and handle it manually
    });

    electronApp.overwolf.packages.on(
      'failed-to-initialize',
      this.logPackageManagerErrors.bind(this),
    );

    electronApp.overwolf.packages.on(
      'package-update-pending',
      (_e: any, info: { name: string; version: string }[]) => {
        const pendingUpdateResult =
          electronApp.overwolf.packages.hasPendingUpdates();
        this.printLogMessage('*** update pending ***', pendingUpdateResult);

        const packages = info.map(p => ({ name: p.name, version: p.version }));

        this.browserWindow?.webContents?.send(
          PackageChannelIpcChannels.UPDATE_PENDING,
          packages,
        );
      },
    );
    electronApp.overwolf.packages.on('loading', (e: any, packageName: string) => {
      this.printLogMessage(`*** [PackageLoading] ${packageName} loading... ***`);
    });

    electronApp.overwolf.packages.on('updated', (e: any, packageName: string, version: string) => {
      this.printLogMessage(`*** [PackageUpdated] ${packageName} hot-updated to v${version} ***`);
    });
  }
  //----------------------------------------------------------------------------
  private logPackageManagerErrors(_e: any, packageName: string, ...args: any[]) {
    this.printLogMessage(
      'Overwolf Package Manager error!',
      packageName,
      ...args,
    );

    const details = args[0] as { reason?: string; version?: string } | undefined;
    const reason = details?.reason ?? 'unknown';
    this.packageInitFailures[packageName] = reason;

    this.browserWindow?.webContents?.send(PackageChannelIpcChannels.INIT_FAILED, {
      name: packageName,
      reason,
    });
  }
  //----------------------------------------------------------------------------
  private async moveWindowToDisplay(target: Electron.Display): Promise<boolean> {
    if (!this.browserWindow) return false;

    // setBounds is silently ignored on maximized/fullscreen windows on Windows.
    if (this.browserWindow.isMaximized() || this.browserWindow.isFullScreen()) {
      await new Promise<void>(resolve => {
        const timer = setTimeout(resolve, 400);
        this.browserWindow!.once('restore', () => { clearTimeout(timer); resolve(); });
        this.browserWindow!.once('leave-full-screen', () => { clearTimeout(timer); resolve(); });
        this.browserWindow!.unmaximize();
        this.browserWindow!.setFullScreen(false);
      });
    }

    this.printLogMessage(
      '[moveWindowToDisplay] target id:', target.id,
      'scale:', target.scaleFactor,
      'workArea:', JSON.stringify(target.workArea),
    );

    // Step 1 — move window to the target display's origin to trigger WM_DPICHANGED.
    const { x, y, width, height } = target.workArea;
    this.browserWindow.setPosition(x, y);

    // Step 2 — wait for the OS to apply the DPI context change.
    await new Promise<void>(resolve => setTimeout(resolve, 150));

    // Step 3 — re-query workArea after DPI update, then resize to 65% centered.
    const { workArea } = screen.getDisplayNearestPoint({ x: x + width / 2, y: y + height / 2 });
    const newW = Math.round(workArea.width * 0.65);
    const newH = Math.round(workArea.height * 0.65);
    const newX = workArea.x + Math.round((workArea.width - newW) / 2);
    const newY = workArea.y + Math.round((workArea.height - newH) / 2);

    this.printLogMessage(
      '[moveWindowToDisplay] setBounds:', JSON.stringify({ x: newX, y: newY, width: newW, height: newH }),
    );

    this.browserWindow.setBounds({ x: newX, y: newY, width: newW, height: newH });
    this.saveDisplayPrefs({ preferredDisplayId: target.id });
    return true;
  }
  //----------------------------------------------------------------------------
  private async moveWindowAwayFromGame(gameDisplay: Electron.Display | null) {
    if (!this.browserWindow) return;

    const displays = screen.getAllDisplays();
    if (displays.length <= 1) return;

    // Pick any display that isn't the one the game is on.
    // If we don't know the game's display, fall back to the non-primary display.
    let target: Electron.Display | undefined;
    if (gameDisplay) {
      target = displays.find(d => d.id !== gameDisplay.id);
    } else {
      const primary = screen.getPrimaryDisplay();
      target = displays.find(d => d.id !== primary.id) ?? primary;
    }

    if (!target) return;

    // Skip the move if the window is already on the target display.
    const bounds = this.browserWindow.getBounds();
    const current = screen.getDisplayNearestPoint({
      x: bounds.x + bounds.width / 2,
      y: bounds.y + bounds.height / 2,
    });
    if (current.id === target.id) return;

    this.printLogMessage('[moveWindowAwayFromGame] game on display', gameDisplay?.id ?? 'unknown', '→ moving to display', target.id);
    await this.moveWindowToDisplay(target);
  }

  private handleShowHideDesktopWindow() {
    this.printLogMessage('show-hide-desktop-window hotkey pressed');

    const visibility = this.browserWindow?.isVisible();

    if (visibility === true) {
      this.browserWindow?.minimize();
    } else {
      this.browserWindow?.restore();

      // We're calling show to make sure the window is brought to front
      this.browserWindow?.show();
    }
  }

  private async captureScreenshotFromHotkey() {
    const outputFolder = path.join(
      electronApp.getPath('pictures'),
      'Overwolf',
      electronApp.name,
    );
    const filePath = path.join(
      outputFolder,
      `screenshot-${this.getTimestampForFileName()}`,
    );

    try {
      await fs.promises.mkdir(outputFolder, { recursive: true });
      const format = this.loadScreenshotFormat();
      const savedPath = await electronApp.overwolf.packages.overlay.takeScreenshot(filePath, format);
      this.printLogMessage('Screenshot saved', savedPath);
    } catch (error) {
      console.error('Failed to capture screenshot from hotkey:', error);
      this.printLogMessage('Failed to save screenshot', error);
    }
  }

  private getTimestampForFileName(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
  }
}
