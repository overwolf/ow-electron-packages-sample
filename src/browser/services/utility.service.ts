import { app, ipcMain } from 'electron';
import { PackageServiceBase } from './base.service';
import {
  GamesFilter,
  IOverwolfUtilityApi,
} from '@overwolf/ow-electron-packages-types';
import { UtilityChannels } from '../../common/channels/channels';
import { kGameIds } from '@overwolf/ow-electron-packages-types/game-list';

export class UtilityService extends PackageServiceBase {
  private _utilityApi?: IOverwolfUtilityApi;
  private _packageReadyPromise: Promise<void>;
  private _packageReadyResolver?: () => void;
  private _isInitialized = false;
  private _isHighElevationHelperInstalled?: boolean;
  private _highElevationInstallPromise?: Promise<boolean>;

  constructor() {
    // super('utility');
    super();
    this._packageReadyPromise = new Promise((resolve) => {
      this._packageReadyResolver = resolve;
    });

    this._utilityApi = app.overwolf.packages.utility;
    this.registerPackageReady();

    if (this._utilityApi) {
      this.packageReady('attached');
    }

    this.registerIPC();
  }

  public async scanAllGames() {
    await this.ensurePackageReady();

    const allGamesFilter: GamesFilter = {
      all: true,
      includeUnsupported: true,
      gamesIds: [],
    };

    /* scan for specific games
    const byIdsFilter: GamesFilter = {
      gamesIds: [
        kGameIds.Fortnite,
        kGameIds.Minecraft,
        kGameIds.LeagueofLegends,
      ],
    };*/

    const installedGames = await this._utilityApi!.scan(allGamesFilter);
    this.log('scan games result', installedGames);
  }

  public async trackGamesByClassId(classId?: number) {
    await this.ensurePackageReady();

    if (classId !== undefined) {
      await this._utilityApi!.trackGames({
        classIds: [classId],
      } as GamesFilter & { classIds: number[] });

      const targetedResult = await this._utilityApi!.scan({
        classIds: [classId],
        includeApplication: true,
      } as GamesFilter & {
        classIds: number[];
        includeApplication: true;
      });

      this.log(
        `tracking utility events for classId ${classId}`,
        targetedResult,
      );
      return targetedResult;
    }

    const defaultGamesFilter: GamesFilter = {
      includeUnsupported: true,
    };

    await this._utilityApi!.trackGames(defaultGamesFilter);
    this.log('tracking utility events with default games-only filter');
  }

  public async isHighElevationHelperInstalled(
    forceRefresh = false,
  ): Promise<boolean> {
    await this.ensurePackageReady();

    if (
      forceRefresh === false &&
      this._isHighElevationHelperInstalled !== undefined
    ) {
      return this._isHighElevationHelperInstalled;
    }

    const installed =
      (await this._utilityApi?.isHighElevationHelperInstalled?.()) ?? false;

    this._isHighElevationHelperInstalled = installed;
    this.log('isHighElevationHelperInstalled', installed);

    return installed;
  }

  public async installHighElevationHelper(): Promise<boolean> {
    await this.ensurePackageReady();

    if (this._highElevationInstallPromise) {
      return this._highElevationInstallPromise;
    }

    this._highElevationInstallPromise = this.installHighElevationHelperInternal();

    try {
      return await this._highElevationInstallPromise;
    } finally {
      this._highElevationInstallPromise = undefined;
    }
  }

  protected packageReady(version: string) {
    if (this._isInitialized) {
      return;
    }

    this._isInitialized = true;
    this._utilityApi = this._utilityApi ?? app.overwolf.packages.utility;
    this._packageReadyResolver?.();

    this.log(`utility package ready: ${version}`);

    if (!this._utilityApi) {
      this.log('utility package API is not available after ready event');
      return;
    }

    this.isHighElevationHelperInstalled(true).catch((error) => {
      this.log('Failed to query high elevation helper state', error);
    });

    // track all game
    this._utilityApi.trackGames({
      includeUnsupported: true,
    });

    // track by games ids
    // this.api.trackGames({
    //   gamesIds: [
    //     kGameIds.Fortnite,
    //     kGameIds.Minecraft,
    //     kGameIds.LeagueofLegends,
    //   ],
    // });

    this._utilityApi.on('game-launched', (gameInfo) => {
      this.log(`*** utility - game launched ${gameInfo.name} ***`);
    });

    this._utilityApi.on('game-exit', (gameInfo) => {
      this.log(`*** utility - game exit ${gameInfo.name} ***`);
    });
  }

  private async ensurePackageReady() {
    if (this._utilityApi) {
      return;
    }

    await this._packageReadyPromise;

    if (!this._utilityApi) {
      throw new Error('Utility package is not ready');
    }
  }

  private registerPackageReady() {
    app.overwolf.packages.on(
      'ready',
      (_e, name: string, version: string) => {
        if (name !== 'utility') {
          return;
        }

        this.packageReady(version);
      },
    );
  }

  private registerIPC() {
    ipcMain.handle('scan-games', async () => {
      return this.scanAllGames();
    });

    ipcMain.handle('track-games', async (_event, classId?: number) => {
      return this.trackGamesByClassId(classId);
    });

    ipcMain.handle(UtilityChannels.GET_HIGH_ELEVATION_HELPER_STATUS, async () => {
      return this.isHighElevationHelperInstalled(true);
    });

    ipcMain.handle(UtilityChannels.INSTALL_HIGH_ELEVATION_HELPER, async () => {
      return this.installHighElevationHelper();
    });
  }

  private async installHighElevationHelperInternal(): Promise<boolean> {
    const alreadyInstalled = await this.isHighElevationHelperInstalled();
    if (alreadyInstalled) {
      this.log('High elevation helper is already installed');
      return true;
    }

    if (!this._utilityApi?.installHighElevationHelper) {
      this.log('installHighElevationHelper API is not available');
      return false;
    }

    this.log('Installing high elevation helper');

    await this._utilityApi.installHighElevationHelper();

    const installed = await this.isHighElevationHelperInstalled(true);
    this.log('High elevation helper install flow completed', installed);

    return installed;
  }
}
