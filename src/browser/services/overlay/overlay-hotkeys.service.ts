import {
  HotkeyCallback,
  IOverlayHotkey,
  IOverwolfOverlayApi,
} from '@overwolf/ow-electron-packages-types';

export class OverlayHotkeysService {
  constructor(private readonly overlayApi: IOverwolfOverlayApi) {}

  /**
   * Registers a hotkey.
   * @param hotkey The hotkey to register.
   * @param callback The callback to invoke when the hotkey is pressed.
   */
  public registerHotkey(
    hotkey: IOverlayHotkey,
    callback: HotkeyCallback,
  ): boolean {
    try {
      this.overlayApi.hotkeys.register(hotkey, callback);
      return true;
    } catch (error) {
      console.error(
        '[OverlayHotkeysService] Failed to register hotkey',
        hotkey,
        error,
      );
      return false;
    }
  }

  /**
   * Unregisters a hotkey.
   * @param hotkey The hotkey to unregister.
   */
  public unregisterHotkey(hotkey: IOverlayHotkey) {
    this.overlayApi.hotkeys.unregister(hotkey.name);
  }

  /**
   * Updates a hotkey.
   * @param hotkey The hotkey to update.
   */
  public updateHotkey(hotkey: IOverlayHotkey): boolean {
    return this.overlayApi.hotkeys.update(hotkey);
  }
}
