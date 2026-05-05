import { app, ipcMain } from 'electron';
import { PackageControllerBase } from '../base.controller';
import { GameEventsService } from '../../services/gep/game-events.service';
import { overwolf } from '@overwolf/ow-electron';

/**
 * Controller for the Game Events Package (GEP).
 * Wires package readiness, IPC handlers, and delegates to the service.
 */
export class GameEventsController extends PackageControllerBase {
  private _gepService: GameEventsService;
  private _gepApi: overwolf.packages.OverwolfGameEventPackage;
  private _registeredGameIds: number[] = [];

  constructor() {
    super('gep');
    this.registerToIpc();
  }

  protected onPackageReady(): void {
    this._gepApi = app.overwolf.packages.gep;
    if (!this._gepService) {
      this._gepService = new GameEventsService(this._gepApi);
    }

    this.registerToGepPackageEvents();
    this.emit('ready');
  }

  /**
   * Registers games for the GEP package.
   */
  public registerToGames(gameIds: number[]) {
    this._registeredGameIds = gameIds;
    this._gepService.registerGames(gameIds);
  }

  /**
   * Register to GEP package events.
   * This is used to handle the game-detected, elevated-privileges-required, new-info-update, new-game-event, error, and game-exit events.
   */
  private registerToGepPackageEvents() {
    this._gepApi.removeAllListeners();

    this._gepApi.on('game-detected', (event, gameId, name, gameInfo) => {
      if (!this._registeredGameIds.includes(gameId)) {
        this.log(`Application is not registered to ${name}, gameId: ${gameId}`);
        return;
      }
      this.log('Game detected', name, gameId, gameInfo);
      this._gepService.enableDetectedGame(event, gameId);
    });

    this._gepApi.on(
      'elevated-privileges-required',
      (event, gameId, name, pid) => {
        this.log(
          `Elevated privileges required for game ${name} (gameId: ${gameId}, pid: ${pid})`,
        );
        return;
      },
    );

    this._gepApi.on('new-info-update', (event, gameId, data) => {
      // Emit to consumers (e.g., MainWindowController) can forward to overlay
      this.emit('gep-info', { gameId, data });
    });

    this._gepApi.on('new-game-event', (event, gameId, data) => {
      // Emit to consumers (e.g., MainWindowController) can forward to overlay
      this.emit('gep-event', { gameId, data });
    });

    this._gepApi.on('error', (event, gameId, error, ...args) => {
      this.log(`GEP error: ${error} (gameId: ${gameId}, ...args: ${args})`);
      return;
    });

    this._gepApi.on('game-exit', (event, gameId, name, pid) => {
      this.log(`Game exit: ${name} (gameId: ${gameId}, pid: ${pid})`);

      this._gepService.onGameExit();
    });
  }

  //------------------------------QA------------------------------------------
  private registerToIpc() {
    ipcMain.handle('gep-set-required-feature', async () => {
      await this._gepService.setRequiredFeaturesForAllSupportedGames();
      return true;
    });

    ipcMain.handle('gep-getInfo', async () => {
      const result = await this._gepService.getInfoForActiveGame();
      this.log('getInfo result:', result);
      return;
    });
  }
  //------------------------------QA------------------------------------------
}
