import {
  GameInputInterception,
  HotkeyState,
  IOverwolfOverlayApi,
} from '@overwolf/ow-electron-packages-types';
import { OverlayHotkeysService } from '../../services/overlay/overlay-hotkeys.service';
import { ipcMain } from 'electron';
import { OverlayChannels } from '../../../common/channels/channels';
import { ExclusiveModeWindowService } from '../../services/overlay/exclusive-mode-window.service';

type ExclusiveBehaviorTypes = 'Toggle' | 'AutoRelease';

/**
 * Controller
 */
export class ExclusiveModeWindowController {
  private _exclusiveModeWindowService: ExclusiveModeWindowService;
  private _hotkeysService: OverlayHotkeysService;

  // Exclusive mode hotkey behavior, in this sample, we default to 'Toggle'
  private _exclusiveModeHotkeyBehavior: ExclusiveBehaviorTypes = 'Toggle';

  constructor(
    overlayApi: IOverwolfOverlayApi,
    hotkeysService: OverlayHotkeysService,
  ) {
    this._exclusiveModeWindowService = new ExclusiveModeWindowService(
      overlayApi,
    );
    this._hotkeysService = hotkeysService;
    this.registerIPC();
    this.registerExclusiveModeHotkey();
  }

  /**
   * Assures that the exclusive mode custom window is created.
   */
  public async assureExclusiveModeWindow(): Promise<void> {
    await this._exclusiveModeWindowService.assureExclusiveModeWindow();
  }

  /**
   * Whenever the game window changes (resolution change, windowed/fullscreen change, etc.),
   * we need to update the size of the exclusive mode custom window to match the new game window size.
   */
  public onGameWindowChanged(): void {
    this._exclusiveModeWindowService.setExclusiveModeCustomWindowSize();
  }

  /**
   * When the game is closed, we need to destroy the exclusive mode custom window
   * to free up resources.
   */
  public onGameExit(): void {
    this._exclusiveModeWindowService.destroyExclusiveModeCustomWindow();
  }

  /**
   * When receiving `game-input-exclusive-mode-changed`, we need to show the
   * custom exclusive mode window if using that type.
   */
  public onExclusiveModeChanged(inputInfo: GameInputInterception): void {
    if (inputInfo.exclusiveMode === true) {
      this._exclusiveModeWindowService.showExclusiveModeCustomWindow();
    }
  }

  /**
   * Enters exclusive mode.
   */
  public enterExclusiveMode(): void {
    this._exclusiveModeWindowService.enterExclusiveMode();
  }

  /**
   * Exits exclusive mode.
   */
  public exitExclusiveMode(): void {
    this._exclusiveModeWindowService.exitExclusiveMode();
  }

  /**
   * Toggles exclusive mode based on the configured hotkey behavior.
   */
  private toggleExclusiveMode(hotkeyState: HotkeyState): void {
    if (this._exclusiveModeHotkeyBehavior === 'Toggle') {
      this._exclusiveModeWindowService.onExclusiveModeToggle(hotkeyState);
    } else if (this._exclusiveModeHotkeyBehavior === 'AutoRelease') {
      this._exclusiveModeWindowService.onExclusiveModeAutoRelease(hotkeyState);
    }
  }

  /**
   * Registers the hotkey to toggle exclusive mode.
   */
  private registerExclusiveModeHotkey(): void {
    // In this example hotkey, we mimic Overwolf Native's exclusive mode toggle
    // hotkey, which is "Ctrl + Tab". You can change it to any other hotkey you want.
    this._hotkeysService.registerHotkey(
      {
        name: 'toggle-exclusive-mode',
        keyCode: 9, // Tab key
        modifiers: {
          ctrl: true,
        },
        passthrough: false,
      },
      (hotkey, state) => {
        this.toggleExclusiveMode(state);
      },
    );
  }

  /**
   * Registers IPC handlers for exclusive mode settings.
   */
  private registerIPC(): void {
    ipcMain.handle(
      OverlayChannels.UPDATE_NATIVE_EXCLUSIVE_MODE_OPTIONS,
      (event, options) => {
        this._exclusiveModeWindowService.updateExclusiveModeOptions(options);
      },
    );

    ipcMain.handle(OverlayChannels.SET_EXCLUSIVE_MODE_TYPE, (event, type) => {
      this._exclusiveModeWindowService.setExclusiveModeType(type);
    });

    ipcMain.handle(
      OverlayChannels.SET_EXCLUSIVE_MODE_HOTKEY_BEHAVIOR,
      (event, behavior) => {
        this.setExclusiveModeHotkeyBehavior(behavior);
      },
    );
  }

  /**
   * Sets the exclusive mode hotkey behavior
   * @param behavior The exclusive mode hotkey behavior.
   */
  private setExclusiveModeHotkeyBehavior(
    behavior: ExclusiveBehaviorTypes,
  ): void {
    this._exclusiveModeHotkeyBehavior = behavior;

    console.log(
      'Exclusive mode hotkey behavior set to',
      this._exclusiveModeHotkeyBehavior,
    );
  }
}
