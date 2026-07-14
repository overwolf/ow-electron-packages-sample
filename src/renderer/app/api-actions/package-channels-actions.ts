export class PackageChannelsActions {
  static getAvailablePackages = (): Promise<string[]> =>
    window.app.getAvailablePackages();

  static getAvailableChannels = (): Promise<Record<string, string[]>> =>
    window.packageChannels.getAvailableChannels();

  static getCurrentChannels = (): Promise<Record<string, string>> =>
    window.packageChannels.getCurrentChannels();

  static getPackageVersions = (): Promise<Record<string, string>> =>
    window.packageChannels.getPackageVersions();

  static setChannel = (
    packageName: string,
    channel?: string,
  ): Promise<{ success: boolean; error?: string }> =>
    window.packageChannels.setChannel(packageName, channel);

  static relaunch = (): Promise<void> =>
    window.packageChannels.relaunch();

  static getLogsFolderPath = (): Promise<string | null> =>
    window.packageChannels.getLogsFolderPath();

  static getInitFailures = (): Promise<Record<string, string>> =>
    window.packageChannels.getInitFailures();

  static openFolder = (folderPath: string): Promise<boolean> =>
    window.app.openFolder(folderPath);

  static onChannelReady = (
    cb: (info: { name: string; version: string }) => void,
  ): void => window.packageChannels.onChannelReady(cb);

  static onUpdatePending = (
    cb: (packages: { name: string; version: string }[]) => void,
  ): void => window.packageChannels.onUpdatePending(cb);

  static onInitFailed = (
    cb: (info: { name: string; reason: string }) => void,
  ): void => window.packageChannels.onInitFailed(cb);
}
