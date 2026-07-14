import {
  IOverwolfOverlayApi,
  OverlayBrowserWindow,
  OverlayWindowOptions,
} from '@overwolf/ow-electron-packages-types';
import EventEmitter from 'events';
import { IngameWindowsService } from '../../services/overlay/ingame-windows.service';

interface ICachedInGameWindowState {
  x?: number;
  y?: number;
  width: number;
  height: number;
  visible: boolean;
}

export class IngameWindowsController extends EventEmitter {
  private _inGameWindowsService: IngameWindowsService;
  private _overlayApi: IOverwolfOverlayApi;
  private _cachedWindowState?: ICachedInGameWindowState;

  constructor(overlayApi: IOverwolfOverlayApi) {
    super();
    this._overlayApi = overlayApi;

    this._inGameWindowsService = new IngameWindowsService(overlayApi);
    this._inGameWindowsService.on('log', (message, ...args) => {
      this.emit('log', message, ...args);
    });
  }

  /**
   * Creates an in-game window with the specified options.
   * You can customize the window options as needed.
   */
  public async makeInGameWindow(): Promise<void> {
    // Define default window options here
    const windowOptions: OverlayWindowOptions = {
      name: 'ingame-window' + Math.floor(Math.random() * 1000),
      height: this._cachedWindowState?.height ?? 899,
      width: this._cachedWindowState?.width ?? 448,
      minHeight: 899,
      minWidth: 448,
      maxHeight: 1000,
      maxWidth: 600,
      show: this._cachedWindowState?.visible ?? true,
      transparent: true,
      resizable: true,
      x: this._cachedWindowState?.x,
      y: this._cachedWindowState?.y,
      // disableHardwareAcceleration: true, 
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    };

    await this._inGameWindowsService.createAndShowInGameWindow(windowOptions);
  }

  /**
   * Creates an in-game DPI aware window without min/max size constraints - Ctrl+X hotkey.
   */
  public async makeDPIAwareWindow(): Promise<void> {
    const windowOptions: OverlayWindowOptions = {
      name: 'dpi-aware-ingame-window' + Math.floor(Math.random() * 1000),
      height: 899,
      width: 448,
      show: true,
      transparent: true,
      resizable: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
      dpiAware: true,
    };

    await this._inGameWindowsService.createAndShowInGameWindow(windowOptions);
  }

  /**
   * Handles game exit by closing all in-game windows.
   */
  public onGameExit(): void {
    this.cachePrimaryWindowState();
    this._inGameWindowsService.destroyAllInGameWindows();
  }

  //------------------------------QA--------------------------------------------
  // Creates an in-game DPI aware window loading an external webpage - Ctrl+O hotkey
  public async createAndShowInGameDpiWindow(): Promise<void> {
    // name should be unique
    const options: OverlayWindowOptions = {
      name: 'dpiOsrWindow-' + Math.floor(Math.random() * 1000),
      height: 800,
      width: 600,
      x: 300,
      y: 10,
      show: true,
      transparent: true,
      resizable: true, // resizable borders
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
      dpiAware: true,
      movable: true,
    };

    await this._inGameWindowsService.createAndShowInGameDpiWindow(options);
  }

  private cachePrimaryWindowState(): void {
    const overlayWindow = this.findPrimaryOverlayWindow();
    if (!overlayWindow) {
      return;
    }

    const bounds = overlayWindow.window.getBounds();
    this._cachedWindowState = {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      visible: overlayWindow.window.isVisible(),
    };
  }

  private findPrimaryOverlayWindow(): OverlayBrowserWindow | undefined {
    return this._overlayApi.getAllWindows().find((window) => {
      return (
        window.name.startsWith('ingame-window') ||
        window.name.startsWith('dpi-aware-ingame-window')
      );
    });
  }
  //------------------------------QA--------------------------------------------
}
