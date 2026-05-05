import { overwolf } from '@overwolf/ow-electron';

export class AppActions {
  static get version(): string {
    return window.app.version;
  }

  static openFolder = async (outputPath: string) => {
    await window.app.openFolder(outputPath);
  };

  

  static previousFolderPath = null;
  static openFolderPicker = async () => {
    const { filePaths } = await window.app.openFolderPicker();

    // If user selected a folder
    if (filePaths && filePaths.length > 0) {
      const selectedPath = filePaths[0];

      if (selectedPath !== AppActions.previousFolderPath) {
        AppActions.previousFolderPath = selectedPath;
        return selectedPath;
      }

      // Same folder selected
      return AppActions.previousFolderPath;
    }

    // Cancel was clicked
    return AppActions.previousFolderPath;
  };


  static onMessage = async (callback: () => void) => {
    window.app.onMessage(callback);
  };

  static scanGames = async () => {
    window.app.scanGames();
  };

  static disableAdsFPD = async () => {
    window.app.disableAdsFPD();
  };

  static checkForPendingUpdates = async () => {
    window.app.hasPendingUpdates();
  };

  static manageCMP = async () => {
    window.privacyApi.manageCMP();
  };

  static isCmpRequired = async () => {
    window.privacyApi.isCmpRequired();
  };

  static generateEmailHashes = async (email: string) => {
    window.privacyApi.generateEmailHashes(email);
  };

  static setUserEmailHashes = async (hashes: overwolf.EmailHashes) => {
    window.privacyApi.setUserEmailHashes(hashes);
  };

  static checkForUpdates = async () => {
    return window.app.checkForUpdates();
  };
}
