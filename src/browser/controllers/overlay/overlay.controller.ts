import { app, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import {
  GamesFilter,
  GameInfo,
  GameWindowInfo,
  IOverwolfOverlayApi,
} from '@overwolf/ow-electron-packages-types';
import { OverlayChannels } from '../../../common/channels/channels';
import { PackageControllerBase } from '../base.controller';
import { OverlayHotkeysService } from '../../services/overlay/overlay-hotkeys.service';
import { IngameWindowsController } from './ingame-windows.controller';
import { ExclusiveModeWindowController } from './exclusive-mode-window.controller';
import { UtilityService } from '../../services/utility.service';

/**
 * Controller for the Overlay package.
 * This class registers to IPC events and handles overlay events.
 */
export class OverlayController extends PackageControllerBase {
  // Overlay API instance
  private _overlayApi: IOverwolfOverlayApi;
  private _hotkeysService: OverlayHotkeysService;
  private _ingameWindowsController: IngameWindowsController;
  private _exclusiveModeWindowController: ExclusiveModeWindowController;
  private _initializedControllers: boolean = false;
  /**
   * Constructor for the OverlayController.
   * @param overlayService - The service responsible for managing overlay windows.
   */
  constructor(private readonly utilityService: UtilityService) {
    super('overlay');
    this.registerToIpc();
  }

  /**
   * Called when the package is ready.
   * Initializes the overlay API and registers to events.
   * @param version - The version of the overlay package.
   */
  protected onPackageReady(): void {
    // Initialize controllers and services
    this._overlayApi = app.overwolf.packages.overlay;

    this.initControllers();
    this.registerToOverlayEvents();
    this.registerDefaultHotkeys();

    // Emit ready for application.ts
    this.emit('ready');
  }

  /**
   * Registers supported games for the overlay.
   */
  public registerToGames(gameIds: number[]) {
    const filter: GamesFilter = {
      gamesIds: gameIds,
      all: false,
    };

    this._overlayApi.registerGames(filter);

    this.log(`Registered games for overlay: ${gameIds.join(', ')}`);
  }

  /**
  * Registers supported games for the overlay.
  */
  public registerToAllGames() {
    const filter: GamesFilter = {
      all: true,
    };

    this._overlayApi.registerGames(filter);

    this.log(`Registered all games for overlay`);
  }

  /**
   * Initializes the controllers and services.
  */
  private initControllers(): void {
    if (this._initializedControllers) return;
    this._hotkeysService = new OverlayHotkeysService(this._overlayApi);
    this._ingameWindowsController = new IngameWindowsController(
      this._overlayApi,
    );
    this._ingameWindowsController.on('log', (message, ...args) => {
      this.emit('log', message, ...args);
    });
    this._exclusiveModeWindowController = new ExclusiveModeWindowController(
      this._overlayApi,
      this._hotkeysService,
    );
    this._initializedControllers = true;
  }

  /**
   * Registers the controller to the overlay events.
   */
  private registerToOverlayEvents(): void {
    // Remove all listeners to avoid duplicates
    this._overlayApi.removeAllListeners();

    this._overlayApi.on('game-launched', async (event, gameInfo) => {
      this.log('Game Launched', gameInfo);

      try {
        await this.handleGameLaunched(event, gameInfo);
      } catch (error) {
        this.log('Error while handling game launch', error);
        event.dismiss();
      }
    });

    this._overlayApi.on('game-injection-error', (gameInfo, error) => {
      this.error(`Game '${gameInfo.id}-${gameInfo.name}' Injection Error - ${error}`, gameInfo, error);
    });

    this._overlayApi.on('game-injected', async (gameInfo) => {
      this.log('Game Injected', gameInfo);

      // Create an in-game window as an example
      try {
        //don't create in-game window for 109021 (LoL Launcher)
        if (gameInfo.type == 'Game') {
          await this._ingameWindowsController.makeInGameWindow();
        }

      } catch (error) {
        this.log('Error creating in-game window', error);
      }

      // Notify main window to move away from the game's screen
      const activeInfo = this._overlayApi.getActiveGameInfo();
      const gameScreen = activeInfo?.gameWindowInfo?.screen ?? null;
      if (gameScreen != null) {
        this.emit('game-on-screen', gameScreen);
      }
    });

    this._overlayApi.on('game-focus-changed', (window, game, focus) => {
      this.log('Game Focus Changed', focus, game, window);
    });

    this._overlayApi.on('game-window-changed', (window, game, reason) => {
      this.log('Game Window Changed', reason, window, game);

      // Update exclusive mode window size if needed
      this._exclusiveModeWindowController.onGameWindowChanged();
    });

    this._overlayApi.on('game-input-interception-changed', async (info) => {
      this.log('Game Input Interception Changed', info);

      // If input interception is disabled, ensure exclusive mode is active
      if (info.canInterceptInput === false) {
        try {
          await this._exclusiveModeWindowController.assureExclusiveModeWindow();
        } catch (error) {
          this.log('Error ensuring exclusive mode window', error);
        }
      }
    });

    this._overlayApi.on('game-input-exclusive-mode-changed', (info) => {
      this.log('Game Input Exclusive Mode Changed', info);

      // Notify exclusive mode controller of exclusive mode changes
      this._exclusiveModeWindowController.onExclusiveModeChanged(info);
    });

    this._overlayApi.on('game-exit', (info) => {
      this.log('Game Exit', info);
      this.emit('game-exit', info);

      // Close all in-game windows
      this._ingameWindowsController.onGameExit();

      // Notify exclusive mode controller of game exit to clean up
      this._exclusiveModeWindowController.onGameExit();
    });
  }

  /**
   * Registers IPC handlers for overlay-related actions.
   */
  private registerToIpc(): void {
    // Updates a hotkey configuration
    ipcMain.handle(OverlayChannels.UPDATE_HOTKEY, (event, hotkey) => {
      const updateResult = this._hotkeysService.updateHotkey(hotkey);

      if (updateResult) {
        this.log(`Hotkey ${hotkey.name} updated successfully.`);
      } else {
        this.log(`Failed to update hotkey ${hotkey.name}.`);
      }
    });

    //------------------------------QA------------------------------------------
    // Shows all currently open overlay windows
    ipcMain.handle(OverlayChannels.TOGGLE_OSR_VISIBILITY, () => {
      const windows = this._overlayApi.getAllWindows();
      windows.forEach((win) => win.window.show());
    });

    // Handle in-game window creation
    ipcMain.handle(OverlayChannels.CREATE_IN_GAME_WINDOW, async (event) => {
      try {
        await this._ingameWindowsController.makeInGameWindow();
      } catch (error) {
        this.log('Error creating in-game window', error);
      }
    });

    ipcMain.handle(OverlayChannels.CREATE_IN_GAME_DPI_WINDOW, async (event) => {
      try {
        await this._ingameWindowsController.createAndShowInGameDpiWindow();
      } catch (error) {
        this.log('Error creating in-game DPI window', error);
      }
    });

  }

  /**
   * Toggles between exclusive mode (full-screen in-game) and normal overlay mode (windowed).
   */
  private toggleExclusiveVsOverlayMode(): void {
    try {
      const gameInfo = this._overlayApi.getActiveGameInfo();
      if (!gameInfo) {
        this.log('No active game found');
        return;
      }

      const isInExclusiveMode = gameInfo.gameInputInfo.exclusiveMode === true;

      if (isInExclusiveMode) {
        // Currently in exclusive mode - switch to normal overlay mode
        this.log('Switching from exclusive mode to overlay mode');
        this._exclusiveModeWindowController.exitExclusiveMode();

        // Show the in-game window
        const overlayWindow = this._overlayApi.getAllWindows().at(0);
        if (overlayWindow) {
          overlayWindow.window.show();
        }
      } else {
        // Currently in normal overlay mode - switch to exclusive mode
        this.log('Switching from overlay mode to exclusive mode');

        // Hide the in-game window
        const overlayWindow = this._overlayApi.getAllWindows().at(0);
        if (overlayWindow) {
          overlayWindow.window.hide();
        }

        // Enter exclusive mode
        this._exclusiveModeWindowController.enterExclusiveMode();
      }
    } catch (error) {
      this.log('Error toggling exclusive vs overlay mode', error);
    }
  }

  /**
   * Registers the app's default hotkeys on launch.
   * Must be called after the overlay package is ready.
   */
  private registerDefaultHotkeys(): void {
    // Example of a non blocked hotkey
    this._hotkeysService.registerHotkey(
      {
        name: 'example-passthrough-hotkey',
        keyCode: 9, // TAB

        passthrough: true,
      },
      (hotkey, state) => {
        this.log(`on hotkey '${hotkey.name}' `, state);
      },
    );
    //--------------------------------------------------------------------------
    // Toggle between exclusive mode and overlay mode
    this._hotkeysService.registerHotkey(
      {
        name: 'toggle-exclusive-overlay-mode',
        keyCode: 69, // e
        modifiers: {
          alt: true,
        },
      },
      (hotkey, state) => {
        if (state === 'pressed') {
          this.log(`pressed '${hotkey.name}'`);
          this.toggleExclusiveVsOverlayMode();
        }
      },
    );
    //--------------------------------------------------------------------------
    // Reset an in-game window passthrough value
    this._hotkeysService.registerHotkey(
      {
        name: 'reset-passthrough',
        keyCode: 82, // r
        modifiers: {
          ctrl: true,
        },
      },
      (hotkey, state) => {
        if (state == 'pressed') {
          this.log(`pressed '${hotkey.name}'`);

          this._overlayApi.getAllWindows()?.forEach((w) => {
            const overlayOptions = w.overlayOptions;
            overlayOptions.passthrough = 'noPassThrough';

            w.window.webContents.send('passthrough-reset');
          });
        }
      },
    );
    //--------------------------------------------------------------------------
    // Reset an in-game window z-order value
    this._hotkeysService.registerHotkey(
      {
        name: 'reset-z-order',
        keyCode: 90, // z
        modifiers: {
          ctrl: true,
        },
      },
      (hotkey, state) => {
        if (state == 'pressed') {
          this.log(`pressed '${hotkey.name}'`);

          this._overlayApi.getAllWindows()?.forEach((w) => {
            const overlayOptions = w.overlayOptions;
            overlayOptions.zOrder = 'default';

            w.window.webContents.send('zOrder-reset');
          });
        }
      },
    );
    //--------------------------------------------------------------------------
    // Show/Hide in-game window
    this._hotkeysService.registerHotkey(
      {
        name: 'show-hide-ingame',
        keyCode: 72, // h
        modifiers: {
          ctrl: true,
        },
      },
      (hotkey, state) => {
        if (state == 'pressed') {
          // Grabbing the first created in-game window as an example
          const overlayWindow = this._overlayApi.getAllWindows().at(0);

          if (overlayWindow) {
            if (overlayWindow.window.isVisible() === true) {
              this.log(`Hiding window: ${overlayWindow.name}`);
              overlayWindow.window.hide();
            } else {
              this.log(`Showing window: ${overlayWindow.name}`);
              overlayWindow.window.restore();
            }
          } else {
            return;
          }
        }
      },
    );
    //--------------------------------------------------------------------------
    // Create a DPI-aware OSR window
    this._hotkeysService.registerHotkey(
      {
        name: 'create-dpi-aware-osr-window',
        keyCode: 88, // x
        modifiers: {
          ctrl: true,
        },
      },
      async (hotkey, state) => {
        if (state == 'pressed') {
          this.log(`pressed '${hotkey.name}'`);

          try {
            await this._ingameWindowsController.makeDPIAwareWindow();
          } catch (error) {
            this.log('Error creating DPI-aware OSR window', error);
          }
        }
      },
    );
    //--------------------------------------------------------------------------
    // Create a DPI-aware OSR window loading an external webpage
    this._hotkeysService.registerHotkey(
      {
        name: 'create-dpi-osr-window',
        keyCode: 79, // o
        modifiers: {
          ctrl: true,
        },
      },
      async (hotkey, state) => {
        if (state == 'pressed') {
          this.log(`pressed '${hotkey.name}'`);

          try {
            await this._ingameWindowsController.createAndShowInGameDpiWindow();
          } catch (error) {
            this.log('Error creating DPI OSR window', error);
          }
        }
      },
    );
    //--------------------------------------------------------------------------
    // Start/Stop recording
    this._hotkeysService.registerHotkey(
      {
        name: 'start-stop-recording',
        keyCode: 66, // b
        modifiers: {
          ctrl: true,
        },
      },
      (hotkey, state) => {
        if (state == 'pressed') {
          this.log(`pressed '${hotkey.name}'`);
          this.emit('start-stop-recording');
        }
      },
    );
    //--------------------------------------------------------------------------
    // Show/Hide desktop window
    this._hotkeysService.registerHotkey(
      {
        name: 'show-hide-desktop-window',
        keyCode: 77, // m
        modifiers: {
          ctrl: true,
        },
      },
      (hotkey, state) => {
        if (state == 'pressed') {
          this.log(`pressed '${hotkey.name}'`);
          this.emit('show-hide-desktop-window');
        }
      },
    );
    //--------------------------------------------------------------------------
    // Take a screenshot using a layout-independent physical key binding
    this._hotkeysService.registerHotkey(
      {
        name: 'take-screenshot',
        keyCode: 'KeyS',
        modifiers: {
          ctrl: true,
          shift: true,
        },

      },
      (hotkey, state) => {
        if (state == 'pressed') {
          this.log(`pressed '${hotkey.name}'`);
          this.emit('take-screenshot');
        }
      },
    );
    //--------------------------------------------------------------------------
    // Move the first OSR window to the top-left corner of the game window
    this._hotkeysService.registerHotkey(
      {
        name: 'move-ingame-top-left',
        keyCode: 'KeyP',
      },
      (hotkey, state) => {
        if (state == 'pressed') {
          const overlayWindow = this._overlayApi.getAllWindows().at(0);
          if (!overlayWindow) {
            return;
          }

          this.log(`pressed '${hotkey.name}'`);
          overlayWindow.window.setPosition(0, 0);
          overlayWindow.window.show();
          overlayWindow.window.moveTop();
        }
      },
    );

    // Show/Hide all windows
    this._hotkeysService.registerHotkey(
      {
        name: 'show-hide-all-windows',
        keyCode: 71, // g
        modifiers: {
          ctrl: true,
        },
      },
      (hotkey, state) => {
        if (state == 'pressed') {
          const allWindows = this._overlayApi.getAllWindows();
          if (allWindows.length === 0) return;
          const shouldHide = allWindows[0].window.isVisible();
          this.log(`${shouldHide ? 'Hiding' : 'Showing'} all windows.`);
          allWindows.forEach((overlayWindow) => {
            if (shouldHide) {
              overlayWindow.window.hide();
            } else {
              overlayWindow.window.restore();
            }
          })
        }
      }
    );
  }

  /**
   * Broadcast a message to all in-game overlay windows.
   */
  public broadcastToIngameWindows(channel: string, payload?: any): void {
    try {
      this._overlayApi.getAllWindows()?.forEach((w) => {
        w.window.webContents.send(channel, payload);
      });
    } catch (error) {
      this.log('broadcastToIngameWindows error', error);
    }
  }

  /**
   * Convenience wrappers for GEP data.
   */
  public sendGepInfoToWindows(info: { gameId: number; data: any }): void {
    this.broadcastToIngameWindows('gep-info', info);
  }

  public sendGepEventToWindows(event: { gameId: number; data: any }): void {
    this.broadcastToIngameWindows('gep-event', event);
  }

  public getActiveGameWindowInfo(): GameWindowInfo | undefined {
    return this._overlayApi?.getActiveGameInfo()?.gameWindowInfo;
  }

  private async handleGameLaunched(
    event: { inject: () => void; dismiss: () => void },
    gameInfo: GameInfo,
  ): Promise<void> {
    if (gameInfo.type !== 'Game') {
      event.dismiss();
      return;
    }

    if (gameInfo.processInfo?.isElevated !== true) {
      event.inject();
      return;
    }

    this.log(
      'Game Launched - Elevated Process Detected',
      gameInfo.name,
      'Checking high elevation helper.',
    );

    const helperInstalled =
      await this.utilityService.isHighElevationHelperInstalled(true);

    if (helperInstalled) {
      this.log(
        `High elevation helper installed. Injecting into elevated game "${gameInfo.name ?? 'Unknown Game'}".`,
      );
      event.inject();
      return;
    }

    const installed = await this.utilityService.installHighElevationHelper();
    if (installed) {
      this.log(
        `High elevation helper installed successfully. Injecting into "${gameInfo.name}".`,
      );
      event.inject();
      return;
    }

    this.log(
      `High elevation helper install did not complete. Skipping injection into "${gameInfo.name}".`,
    );
    event.dismiss();
  }
}
