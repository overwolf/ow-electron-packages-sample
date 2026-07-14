import {
  IOverwolfOverlayApi,
  OverlayBrowserWindow,
  OverlayWindowOptions,
} from '@overwolf/ow-electron-packages-types';
import path from 'path';
import { PackageServiceBase } from '../base.service';

/**
 * Service responsible for managing in-game overlay windows.
 */
export class IngameWindowsService extends PackageServiceBase {
  private _overlayApi: IOverwolfOverlayApi;

  constructor(overlayApi: IOverwolfOverlayApi) {
    super();
    this._overlayApi = overlayApi;
  }

  /**
   * Creates and shows an in-game window with the specified options.
   * @param windowOptions The options for the in-game window.
   */
  public async createAndShowInGameWindow(
    windowOptions: OverlayWindowOptions,
  ): Promise<void> {

    const openWindows = this._overlayApi.getAllWindows();

    if (openWindows.some(window => window.name === windowOptions.name)) {
      this.log(`Window with name ${windowOptions.name} already exists`);
      return;
    }

    // Create the window using the overlay API with the provided options
    const window = await this._overlayApi.createWindow(windowOptions);

    // Load the OSR html file into the window
    try {
      await window.window.loadFile(
        path.join(__dirname, '../renderer/osr/osr.html'),
      );
    } catch (error) {
      // Clean up the created window if loading fails
      window.window.close();
      throw error;
    }

    // Register IPC handlers for the window
    this.registerWindowToIpc(window);

    // Respect the requested visibility so re-injected windows can restore hidden state.
    if (windowOptions.show !== false) {
      window.window.show();
    }
  }

  /**
   * Closes all in-game windows.
   */
  public destroyAllInGameWindows(): void {
    let openWindows = this._overlayApi.getAllWindows();
    openWindows.forEach(window => window.window.close());
  }

  /**
   * Register to IPC handlers for in-game window actions like setting passthrough and z-order.
   */
  private registerWindowToIpc(overlayWindow: OverlayBrowserWindow): void {
    // Get the IPC object for the specific window
    const windowIpc = overlayWindow.window.webContents.ipc;

    // IPC handler that sets the passthrough value for the window
    windowIpc.on('setPassthrough', (event, value) => {
      overlayWindow.overlayOptions.passthrough = value;
      this.log(`- osr setPassthrough ${value}`);
    });

    // IPC handler that sets the z-order value for the window
    windowIpc.on('setZorder', (event, value) => {
      overlayWindow.overlayOptions.zOrder = value;
      this.log(`- osr position ${value}`);
    });

    // IPC handler that closes the window and removes it from the map
    windowIpc.on('closeWindow', (event) => {
      try {
        overlayWindow.window.close();
      } catch (error) {
        console.error('Failed to close in-game window:', error);
      }
    });

    // IPC handler that minimizes the window
    windowIpc.on('minimizeWindow', (event) => {
      try {
        overlayWindow.window.minimize();
      } catch (error) {
        console.error('Failed to minimize in-game window:', error);
      }
    });

    //------------------------------QA------------------------------------------
    // IPC handler that opens devtools for the window
    windowIpc.on('devtools', () => {
      overlayWindow.window.webContents.openDevTools({ mode: 'detach' });
    });

    // IPC handler that resizes the window to random dimensions
    windowIpc.on('randomResize', () => {
      const newWidth = Math.floor(Math.random() * 800) + 200;
      const newHeight = Math.floor(Math.random() * 800) + 200;
      overlayWindow.window.setSize(newWidth, newHeight);
    });

    // IPC handler that moves the window to a random position within the game window
    windowIpc.on('randomMove', () => {
      const gameWindowInfo =
        this._overlayApi.getActiveGameInfo().gameWindowInfo;

      if (!gameWindowInfo) {
        return;
      }

      const maxX =
        gameWindowInfo.size.width - overlayWindow.window.getBounds().width;
      const maxY =
        gameWindowInfo.size.height - overlayWindow.window.getBounds().height;
      const newX = Math.floor(Math.random() * maxX);
      const newY = Math.floor(Math.random() * maxY);
      overlayWindow.window.setPosition(newX, newY);
    });

    windowIpc.on('startDraggingOsr', () => {
      //@ts-ignore
      overlayWindow.startDragging();
    });
    //------------------------------QA------------------------------------------
  }

  //------------------------------QA--------------------------------------------
  public async createAndShowInGameDpiWindow(
    windowOptions: OverlayWindowOptions,
  ): Promise<void> {
    const openWindows = this._overlayApi.getAllWindows();
    if (openWindows.some(window => window.name === windowOptions.name)) {
      this.log(`Window with name ${windowOptions.name} already exists`);
      return;
    }
  
    const window = await this._overlayApi.createWindow(windowOptions);

    // Re-inject on every load, since in-page navigations/redirects on the
    // external site replace the DOM and wipe out the previous injection.
    window.window.webContents.on('did-finish-load', () => {
      this.injectDragHeader(window);
    });

    try {
      await window.window.loadURL(
        'https://checkout.tebex.io/payment-history',
      );
    } catch (error) {
      window.window.close();
      throw error;
    }

    this.registerWindowToIpc(window);
    window.window.show();
  }

  /**
   * Injects a minimal drag region + close button into a window that loads
   * external content directly, since it won't have our own osr.html header.
   */
  private injectDragHeader(overlayWindow: OverlayBrowserWindow): void {
    overlayWindow.window.webContents.executeJavaScript(`
      (() => {
        const header = document.createElement('div');
        header.style.cssText = 'position:fixed;top:0;left:0;right:0;height:32px;' +
          'background:rgba(20,20,20,0.85);z-index:2147483647;-webkit-app-region:drag;';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '\\u2715';
        closeBtn.style.cssText = 'position:fixed;top:0;right:0;width:32px;height:32px;' +
          'z-index:2147483647;-webkit-app-region:no-drag;background:transparent;' +
          'color:#fff;border:none;cursor:pointer;font-size:14px;';
        closeBtn.addEventListener('click', () => {
          require('electron').ipcRenderer.send('closeWindow');
        });

        document.body.style.marginTop = '32px';
        document.body.appendChild(header);
        document.body.appendChild(closeBtn);
      })();
    `);
  }
  //------------------------------QA--------------------------------------------
}
