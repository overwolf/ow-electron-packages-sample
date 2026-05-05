import {
  ExclusiveInputOptions,
  IOverwolfOverlayApi,
  OverlayBrowserWindow,
  OverlayWindowOptions,
  GameWindowInfo,
  HotkeyState,
} from '@overwolf/ow-electron-packages-types';
import path from 'path';

type ExclusiveModeTypes = 'native' | 'customWindow';

/**
 * Controller for managing an exclusive mode window.
 * Exclusive mode is used in games where the mouse is not visible while playing the game.
 * For example, in FPS games such as Apex Legends, Fortnite and others,
 * the mouse cursor is not visible during gameplay, so the only way to interact
 * with the in-game window is by entering exclusive mode.
 * You can read more about it here:
 * https://dev.overwolf.com/ow-electron/reference/Overwolf-electron-APIs/overlay/Overview/#exclusive-mode
 *
 * There are 2 ways to implement exclusive mode:
 * 1. Native - A customizable background is shown when entering exclusive mode.
 *    The background can be customized with color and animation duration.
 * 2. Custom Window - A custom window, customizable through HTML and CSS,
 *    is created to act as the exclusive mode background.
 */
export class ExclusiveModeWindowService {
  private _overlayApi: IOverwolfOverlayApi;
  private _exclusiveWindow: OverlayBrowserWindow | null = null;

  // Default native exclusive mode options
  private _inputOptions: ExclusiveInputOptions = {
    backgroundColor: 'rgba(12, 12, 12, 0.5)',
    fadeAnimateInterval: 100,
  };

  // Exclusive mode type, in this sample, we default to 'native'
  private _type: ExclusiveModeTypes = 'native';

  constructor(overlayApi: IOverwolfOverlayApi) {
    this._overlayApi = overlayApi;
  }

  /**
   * Assures that the exclusive mode custom window is created.
   * If the exclusive mode type is 'native' or the window already exists, does nothing.
   */
  public async assureExclusiveModeWindow(): Promise<void> {
    // Don't create a custom window if native exclusive mode is selected
    // or if the custom window already exists
    if (this._type === 'native' || this._exclusiveWindow !== null) {
      return;
    }

    await this.createExclusiveModeCustomWindow();
  }

  /**
   * Enters exclusive mode based on the current exclusive mode type.
   * By using `overlayApi.enterExclusiveMode()`, we trigger the `game-input-exclusive-mode-changed`
   * event, which lets the controller know that exclusive mode has been entered.
   */
  public async enterExclusiveMode(): Promise<void> {
    switch (this._type) {
      case 'native':
        this._overlayApi.enterExclusiveMode(this._inputOptions);
        break;
      case 'customWindow':{
         // When using a custom exclusive mode window,
        // we first need to `enterExclusiveMode()` with a transparent native exclusive
        // mode background, so our custom window will be visible.
        await this.assureExclusiveModeWindow();

        this._overlayApi.enterExclusiveMode({
          backgroundColor: 'rgba(0,0,0,0)',
        });
      } break;
    }
  }

  /**
   * Sets the exclusive mode type to either 'native' or 'customWindow'.
   * Call this method before entering exclusive mode to determine which mode to use.
   * @param type The exclusive mode type ('native' or 'customWindow')
   */
  public setExclusiveModeType(type: ExclusiveModeTypes): void {
    this._type = type;
  }

  /**
   * Shows the exclusive mode custom window, if it exists.
   */
  public showExclusiveModeCustomWindow(): void {
    if (this._type === 'customWindow' && this._exclusiveWindow !== null) {
      this._exclusiveWindow.window.show();
    }
  }

  /**
   * Exits exclusive mode.
   */
  public exitExclusiveMode(): void {
    // If using a custom window, hide it first
    if (this._type === 'customWindow' && this._exclusiveWindow !== null) {
      this._exclusiveWindow.window.hide();
    }

    this._overlayApi.exitExclusiveMode();
  }

  /**
   * Sets the size of the custom exclusive mode window to match the active game's window size.
   */
  public setExclusiveModeCustomWindowSize(): void {
    if (this._exclusiveWindow === null) {
      return;
    }

    const activeGameInfo = this._overlayApi.getActiveGameInfo();
    if (!activeGameInfo || !activeGameInfo.gameWindowInfo) {
      return;
    }
    const activeGame: GameWindowInfo = activeGameInfo.gameWindowInfo;

    this._exclusiveWindow.window.setSize(
      activeGame.size.width,
      activeGame.size.height,
    );
  }

  /**
   * Enters or exits exclusive mode on 'pressed' based on toggle behavior.
   * @param hotkeyState The current state of the hotkey ('pressed' or 'released')
   */
  public onExclusiveModeToggle(hotkeyState: HotkeyState): void {
    // Only proceed on 'pressed' state
    if (hotkeyState !== 'pressed') {
      return;
    }

    const inputInfo = this._overlayApi.getActiveGameInfo().gameInputInfo;

    // Enter or exit exclusive mode based on it's current state
    if (inputInfo.exclusiveMode === true) {
      if (this._type === 'customWindow') {
        // If using custom window, we want to hide the window first
        this._exclusiveWindow?.window.hide();
      }
      this._overlayApi.exitExclusiveMode();
    } else {
      this.enterExclusiveMode();
    }
  }

  /**
   * Enters exclusive mode on 'pressed' and exits on 'released'.
   * @param hotkeyState The current state of the hotkey ('pressed' or 'released')
   */
  public onExclusiveModeAutoRelease(hotkeyState: HotkeyState): void {
    if (hotkeyState === 'pressed') {
      this.enterExclusiveMode();
    } else if (hotkeyState === 'released') {
      if (this._type === 'customWindow') {
        // If using custom window, we want to hide the window first
        this._exclusiveWindow?.window.hide();
      }
      this._overlayApi.exitExclusiveMode();
    }
  }

  /**
   * Closes and clears the current exclusive-mode custom window, if one exists.
   */
  public destroyExclusiveModeCustomWindow(): void {
    if (this._exclusiveWindow !== null) {
      this._exclusiveWindow.window.close();
      this._exclusiveWindow = null;
    }
  }

  /**
   * Updates the exclusive mode input options with the provided values.
   * Call this method to change the appearance or behavior of exclusive mode (e.g., background color, animation interval).
   * @param options Partial options to override the current exclusive mode settings.
   */
  public updateExclusiveModeOptions(options: ExclusiveInputOptions): void {
    this._inputOptions = { ...this._inputOptions, ...options };
  }

  /**
   * Creates a custom overlay window to be used in exclusive mode.
   * The window is sized to match the active game's window size.
   */
  private async createExclusiveModeCustomWindow(): Promise<void> {
    const activeGameInfo = this._overlayApi.getActiveGameInfo();
    if (!activeGameInfo || !activeGameInfo.gameWindowInfo) {
      // No active game, cannot create window
      return;
    }
    const activeGame: GameWindowInfo = activeGameInfo.gameWindowInfo;

    const options: OverlayWindowOptions = {
      name: 'exclusiveMode',
      width: activeGame.size.width,
      height: activeGame.size.height,
      zOrder: 'bottomMost',
      transparent: true,
      passthrough: 'passThrough',
      resizable: false,
      webPreferences: { nodeIntegration: true, contextIsolation: false },
    };

    try {
      this._exclusiveWindow = await this._overlayApi.createWindow(options);

      await this._exclusiveWindow.window.loadFile(
        path.join(__dirname, '../exclusive/exclusive.html'),
      );

      this._exclusiveWindow.window.hide();
      // this._exclusiveWindow.window.webContents.openDevTools({ mode: 'detach' });
    } catch (error) {
      console.error('Error creating exclusive mode window:', error);
    }
  }
}

