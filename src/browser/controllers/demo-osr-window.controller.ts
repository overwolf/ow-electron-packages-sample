import path from "path";
import { OverlayService } from "../services/overlay.service";
import { OverlayBrowserWindow, OverlayWindowOptions, PassthroughType, ZOrderType } from "@overwolf/ow-electron-packages-types";

/**
 *
 */
export class DemoOSRWindowController {
  private overlayWindow: OverlayBrowserWindow = null;


  /**
   *
   */
  public get overlayBrowserWindow() : OverlayBrowserWindow {
    return this.overlayWindow;
  }

  /**
   *
   */
  constructor(private readonly overlayService: OverlayService) {
  }

  /**
   *
   */
  public async createAndShow(showDevTools: boolean) {
    // name should be unique
    const options: OverlayWindowOptions = {
      name: 'osrWindow-' + Math.floor(Math.random() * 1000),
      height: 700,
      width: 500,
      show: true,
      transparent: true,
      resizable: true, // resizable borders
      webPreferences: {
        devTools: showDevTools,
        nodeIntegration: true,
        contextIsolation: false,
      },
    };

    // random positions
    const activeGame = this.overlayService.overlayApi.getActiveGameInfo();
    const gameWindowInfo = activeGame?.gameWindowInfo;

    const screenWidth = gameWindowInfo?.size.width || 500;
    options.x = this.randomInteger(0, screenWidth - options.width);
    options.y = 10;

    this.overlayWindow = await this.overlayService.createNewOsrWindow(
      options,
    );

    this.registerToIpc();

    this.registerToWindowEvents();

    await this.overlayWindow.window.loadURL(
      path.join(__dirname, '../renderer/osr.html')
    );

    this.overlayWindow.window.show();
  }

  /**
   *
   */
  private registerToIpc() {
    const windowIpc = this.overlayWindow.window.webContents.ipc;

    windowIpc.on('resizeOsrClick', (e) => {
      this.handleResizeCommand();
    });

    windowIpc.on('moveOsrClick', (e) => {
      this.handleMoveCommand();
    });

    windowIpc.on('minimizeOsrClick', (e) => {
      const window = this.overlayWindow.window;
      window?.minimize();
    });

    windowIpc.on('setPassthrough', (e, value) => {
      let pass = parseInt(value);
      this.setWindowPassthrough(pass);
    });

    windowIpc.on('setZorder', (e, value) => {
      let zOrder = parseInt(value);
      this.setWindowZorder(zOrder);
    });

    windowIpc.on('devtools', () => {
      this.overlayWindow.window.webContents.openDevTools({ mode: 'detach' });
    });
  }

  /**
   *
  */
  private registerToWindowEvents() {
    const browserWindow = this.overlayWindow.window;
    browserWindow.on('closed', () =>{
      this.overlayWindow = null;
      console.log('osr window closed');
    })
  }

  /**
   *
   */
  private handleResizeCommand() {
    const window = this.overlayWindow.window;

    window?.setSize(this.randomInteger(100, 500), this.randomInteger(100, 500));
  }

  /**
   *
   */
  private handleMoveCommand() {
    const { overlayApi } = this.overlayService;

    const gameWindowInfo = overlayApi.getActiveGameInfo()?.gameWindowInfo;
    if (!gameWindowInfo) {
      return;
    }

    const window = this.overlayWindow.window;
    window?.setPosition(
      this.randomInteger(0, gameWindowInfo.size.width - 100),
      this.randomInteger(0, gameWindowInfo.size.height - 100)
    );
  }

  /**
   *
   */
  private setWindowPassthrough(pass: PassthroughType) {
    this.overlayWindow.overlayOptions.passthrough = pass;
  }

  /**
   *
   */
  private setWindowZorder(zOrder: ZOrderType) {
    this.overlayWindow.overlayOptions.zOrder = zOrder;
  }

  /**
   *
   */
  private randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}