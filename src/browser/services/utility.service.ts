import { app, ipcMain } from 'electron';
import { PackageServiceBase } from './base.service';
import {
  GamesFilter,
  IOverwolfUtilityApi,
} from '@overwolf/ow-electron-packages-types';
import { kGameIds } from '@overwolf/ow-electron-packages-types/game-list';

export class UtilityService extends PackageServiceBase {

  private _utilityApi?: IOverwolfUtilityApi;
  private _packageReadyPromise: Promise<void>;
  private _packageReadyResolver?: () => void;
  private _isInitialized = false;

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

  // protected get api(): IOverwolfUtilityApi {
  //   return (this.overwolf.packages as any).utility as IOverwolfUtilityApi;
  // }

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
  }
}
