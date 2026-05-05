import { ExclusiveInputOptions } from '@overwolf/ow-electron-packages-types';

export class OverlayActions {
  static setExclusiveModeType = async (mode: string) => {
    await window.overlay.setExclusiveModeType(mode);
  };

  static setExclusiveModeHotkeyBehavior = async (behavior: string) => {
    await window.overlay.setExclusiveModeHotkeyBehavior(behavior);
  };

  static updateNativeExclusiveModeOptions = async (
    options: ExclusiveInputOptions,
  ) => {
    window.overlay.updateNativeExclusiveModeOptions(options);
  };
}
