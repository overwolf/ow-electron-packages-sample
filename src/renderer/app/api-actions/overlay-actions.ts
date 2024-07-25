export class OverlayActions {
  static setExclusiveModeType = async (mode) => {
    await window.overlay.setExclusiveModeType(mode);
  };

  static setExclusiveModeHotkeyBehavior = async (mode) => {
    const { filePaths } = await window.overlay.setExclusiveModeHotkeyBehavior(
      mode,
    );
    return filePaths[0];
  };

  static updateExclusiveOptions = async (options) => {
    window.overlay.updateExclusiveOptions(options);
  };
}
