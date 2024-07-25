export class AppActions {
  static get version(): string {
    return window.app.version;
  }

  static openFolder = async (outputPath: string) => {
    await window.app.openFolder(outputPath);
  };

  static openFolderPicker = async () => {
    const {filePaths} = await window.app.openFolderPicker();
    return filePaths[0];
  };

  static onMessage = async (callback: () => void) => {
    window.app.onMessage(callback);
  };
}
