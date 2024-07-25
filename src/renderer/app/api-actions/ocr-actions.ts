export class OsrActions {

  static openOSR = async () => {
    await window.osr.openOSR();
  };

  static toggle = async () => {
    await window.osr.toggle();
  };

  static updateHotkey = async () => {
    await window.osr.updateHotkey();
  };
}
