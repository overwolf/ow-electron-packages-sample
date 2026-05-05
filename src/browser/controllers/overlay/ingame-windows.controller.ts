import {
  IOverwolfOverlayApi,
  OverlayWindowOptions,
} from '@overwolf/ow-electron-packages-types';
import { IngameWindowsService } from '../../services/overlay/ingame-windows.service';

export class IngameWindowsController {
  private _inGameWindowsService: IngameWindowsService;

  constructor(overlayApi: IOverwolfOverlayApi) {
    this._inGameWindowsService = new IngameWindowsService(overlayApi);
  }

  /**
   * Creates an in-game window with the specified options.
   * You can customize the window options as needed.
   */
  public async makeInGameWindow(): Promise<void> {
    // Define default window options here
    const windowOptions: OverlayWindowOptions = {
      name: 'ingame-window' + Math.floor(Math.random() * 1000),
      height: 899,
      width: 448,
      minHeight: 899,
      minWidth: 448,
      maxHeight: 1000,
      maxWidth: 600,
      show: true,
      transparent: true,
      resizable: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    };

    await this._inGameWindowsService.createAndShowInGameWindow(windowOptions);
  }

  /**
   * Handles game exit by closing all in-game windows.
   */
  public onGameExit(): void {
    this._inGameWindowsService.destroyAllInGameWindows();
  }

  //------------------------------QA--------------------------------------------
  public async createAndShowInGameDpiWindow(): Promise<void> {
    // name should be unique
    const options: OverlayWindowOptions = {
      name: 'dpiOsrWindow-' + Math.floor(Math.random() * 1000),
      height: 1200,
      width: 900,
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
  //------------------------------QA--------------------------------------------
}
