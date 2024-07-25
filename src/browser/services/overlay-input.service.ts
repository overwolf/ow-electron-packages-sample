import { app, ipcMain } from 'electron';
import { OverlayService } from './overlay.service';
import { overwolf } from '@overwolf/ow-electron';
import {
  ExclusiveInputOptions,
  GameInfo,
  GameInputInterception,
  GameWindowInfo,
  IOverwolfOverlayApi,
  OverlayBrowserWindow,
  OverlayWindowOptions,
  PassthroughType,
  ZOrderType,
} from '@overwolf/ow-electron-packages-types';
import path from 'path';

const owElectron = app as overwolf.OverwolfApp;

export enum ExclusiveHotKeyMode {
  Toggle,
  AutoRelease,
}

export class OverlayInputService {
  private exclusiveModeBackgroundWindow: OverlayBrowserWindow = null;

  private inputOptions: ExclusiveInputOptions = {
    backgroundColor: 'rgba(12, 12, 12, 0.5)',
  };

  public exclusiveModeAsWindow = false;
  public mode: ExclusiveHotKeyMode = ExclusiveHotKeyMode.Toggle;

  constructor(overlayService: OverlayService) {
    overlayService.on('ready', this.init.bind(this));
    this.registerIPC()
  }

  /**
   *
   */
  public updateExclusiveModeOptions(options: any) {
    this.inputOptions = {
      fadeAnimateInterval: options?.animationDuration,
      backgroundColor: options?.color,
    };
  }

  /** */
  private init() {
    this.registerExclusiveModeHotkey();

    this.overlayApi.on('game-injected', (gameInfo) => {
      this.onNewGameInjected(gameInfo);
    });

    this.overlayApi.on('game-exit', (gameInfo, wasInjected) => {
      if (wasInjected) {
        this.onGameExit();
      }
    });

    this.overlayApi.on('game-window-changed', (window, gameInfo, reason) => {
      this.onUpdateGameWindow(window);
    });

    this.overlayApi.on('game-input-interception-changed', (info) => {
      if (info.canInterceptInput === false) {
        this.assureExclusiveModeWindow();
      }
    });

    this.overlayApi.on('game-input-exclusive-mode-changed', (info) => {
      this.onGameExclusiveModeChanged(info);
    });
  }

  private registerExclusiveModeHotkey() {
    this.overlayApi.hotkeys.register(
      {
        name: 'ExclusiveMode',
        keyCode: 9, // TAB
        modifiers: {
          ctrl: true,
        },
        passthrough: false,
      },
      (hotkey, state) => {
        this.onExclusiveModeHotkey(state == 'pressed');
      }
    );
  }

  async assureExclusiveModeWindow() {
    if (!this.exclusiveModeAsWindow || this.exclusiveModeBackgroundWindow) {
      return;
    }

    const activeGame = this.overlayApi.getActiveGameInfo();
    const width = activeGame?.gameWindowInfo?.size.width || 500;
    const height = activeGame?.gameWindowInfo?.size.height || 500;

    const options: OverlayWindowOptions = {
      name: 'exclusiveModeBackground',
      height: height,
      width: width,
      show: true,
      passthrough: PassthroughType.PassThrough,
      zOrder: ZOrderType.BottomMost,
      transparent: true,
      resizable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        devTools: true,
      },
    };

    this.exclusiveModeBackgroundWindow = await this.overlayApi.createWindow(
      options
    );

    this.registerOverlayIpc();

    await this.exclusiveModeBackgroundWindow.window.loadURL(
      path.join(__dirname, '../exclusive/exclusive.html')
    );

    this.exclusiveModeBackgroundWindow.window.webContents.openDevTools({
      mode: 'detach',
    });

    this.exclusiveModeBackgroundWindow.window.hide();
  }

  private registerOverlayIpc() {
    const windowIpc = this.exclusiveModeBackgroundWindow.window.webContents.ipc;

    windowIpc.on('HIDE_EXCLUSIVE', (e) => {
      this.exclusiveModeBackgroundWindow.window.hide();
    });
    
  }

  onGameExclusiveModeChanged(info: GameInputInterception) {
    if (!this.exclusiveModeBackgroundWindow) {
      return;
    }

    if (!this.exclusiveModeAsWindow) {
      this.exclusiveModeBackgroundWindow?.window?.hide();
      return;
    }

    if (info.exclusiveMode == true) {
      this.exclusiveModeBackgroundWindow.window.show();
    }

    this.exclusiveModeBackgroundWindow.window.webContents.send(
      'EXCLUSIVE_MODE',
      info.exclusiveMode == true
    );
  }

  onUpdateGameWindow(window: GameWindowInfo) {
    if (!this.exclusiveModeBackgroundWindow) {
      return;
    }

    // keep exclusive mode background window as full screen (game size)
    this.exclusiveModeBackgroundWindow.window.setSize(
      window.size.width,
      window.size.height
    );
  }

  onNewGameInjected(gameInfo: GameInfo) {
    //throw new Error("Method not implemented.");
    this.assureExclusiveModeWindow();
  }

  onGameExit() {
    this.exclusiveModeBackgroundWindow?.window?.close();
    this.exclusiveModeBackgroundWindow = null;
  }

  private onExclusiveModeHotkey(pressed: boolean) {
    const inputInfo = this.overlayApi?.getActiveGameInfo()?.gameInputInfo;
    if (!inputInfo) {
      // not in game?
      return;
    }

    switch (this.mode) {
      case ExclusiveHotKeyMode.Toggle:
        this.onHotKeyToggle(pressed, inputInfo);
        break;
      case ExclusiveHotKeyMode.AutoRelease:
        this.onHotKeyAutoRelease(pressed, inputInfo);
        break;
    }
  }

  private onHotKeyAutoRelease(
    pressed: boolean,
    inputInfo: GameInputInterception
  ) {
    if (!pressed) {
      this.overlayApi?.exitExclusiveMode();
      return;
    }
    this.enterExclusiveMode();
  }

  private onHotKeyToggle(pressed: boolean, inputInfo: GameInputInterception) {
    if (!pressed) {
      return;
    }

    if (inputInfo.exclusiveMode === true) {
      this.overlayApi?.exitExclusiveMode();
      return;
    }

    this.enterExclusiveMode();
  }

  private enterExclusiveMode() {
    /*
    if (inputInfo.canInterceptInput == true) {
      return;
    }
    */

    if (this.exclusiveModeAsWindow) {
      this.overlayApi?.enterExclusiveMode({
        backgroundColor: 'rgba(0,0,0,0)',
      });
    } else {
      this.exclusiveModeBackgroundWindow?.window.hide();
      this.overlayApi?.enterExclusiveMode(this.inputOptions);
    }
  }

  get overlayApi(): IOverwolfOverlayApi {
    return (owElectron.overwolf.packages as any).overlay as IOverwolfOverlayApi;
  }

  private registerIPC() {
    ipcMain.handle('updateExclusiveOptions', async (sender, options) => {
      this.updateExclusiveModeOptions(options);
    });

    ipcMain.handle('EXCLUSIVE_TYPE', async (sender, type) => {
      if (type === 'customWindow') {
        this.exclusiveModeAsWindow = true;
        return;
      }

      // native
      this.exclusiveModeAsWindow = false;
    });

    ipcMain.handle('EXCLUSIVE_BEHAVIOR', async (sender, behavior) => {

      if (behavior === 'toggle') {
        this.mode = ExclusiveHotKeyMode.Toggle;
        return;
      }

      // native
      this.mode = ExclusiveHotKeyMode.AutoRelease;
    });
  }
}
