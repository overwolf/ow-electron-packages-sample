import { app } from "electron";
import { overwolf } from '@overwolf/ow-electron'
import { ExclusiveInputOptions, IOverwolfOverlayApi, PassthroughType, ZOrderType } from '@overwolf/ow-electron-packages-types';
import EventEmitter from "events";
import { OverlayService } from "./overlay.service";

const owElectron = app as overwolf.OverwolfApp;

/**
 * Sample class handling in-game hotkeys
 */
export class OverlayHotkeysService extends EventEmitter {
  /**
   *
   */
  constructor(overlayService: OverlayService) {
    super();

    overlayService.on('ready', this.installHotKeys.bind(this));
  }

  /**
   *
   * Update existing hotkey
   */
  public updateHotkey() {
    if (!this.overlayApi) {
      return;
    }

    // update existing hot key...
    const hotkey = 'tabHotKeyPassThrow';
    const passThrowHotKey =
      this.overlayApi.hotkeys.all().find(h => h.name == hotkey);

    passThrowHotKey.passthrough = !passThrowHotKey.passthrough;
    this.overlayApi.hotkeys.update(passThrowHotKey);
  };

  /**
   * Install Overlay hotkeys. must be call after 'overlay' package is ready
   */
  private installHotKeys() {

    // non blocked hot key
    this.overlayApi.hotkeys.register({
      name: "tabHotKeyPassThrow",
      keyCode: 9, // TAB

      passthrough: true

    }, (hotkey, state) => {
      this.log(`on hotkey '${hotkey.name}' `, state);
    })

    // reset OSR passthrough
    this.overlayApi.hotkeys.register({
      name: "resetPassThrow",
      keyCode: 82, // r
      modifiers: {
        ctrl: true
      },
      passthrough: true

    }, (hotkey, state) => {
      console.info(`on hotkey '${hotkey.name}' `, state);

      if (state == 'pressed') {
        this.resetOSRPassthrough();
      }
    })

    // reset zOrder
    this.overlayApi.hotkeys.register({
      name: "resetzOrder",
      keyCode: 90, // z
      modifiers: {
        ctrl: true
      },
      passthrough: true

    }, (hotkey, state) => {
      console.info(`on hotkey '${hotkey.name}' `, state);

      if (state == 'pressed') {
        this.resetZOrder();
      }
    })
  }

  private resetOSRPassthrough() {
    this.log(`resting passthrough!`);

    this.overlayApi?.getAllWindows()?.forEach(w => {
      const overlayOptions = w.overlayOptions;
      overlayOptions.passthrough = PassthroughType.NoPassThrough;
    })
  }

  private resetZOrder() {
    this.log(`resting zOrder!`);

    this.overlayApi.getAllWindows()?.forEach(w => {
      const overlayOptions = w.overlayOptions;
      overlayOptions.zOrder = ZOrderType.Default;
    })
  }

  /** */
  private log(message: string, ...args: any[]) {
    this.emit('log', message, ...args);
  }

  //----------------------------------------------------------------------------
  get overlayApi(): IOverwolfOverlayApi {
    return (owElectron.overwolf.packages as any).overlay as IOverwolfOverlayApi;
  }
}