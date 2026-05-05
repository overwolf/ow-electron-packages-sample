import { overwolf } from '@overwolf/ow-electron';
import EventEmitter from 'events';

/**
 * Service used to interact with the Overwolf Game Events Package (GEP).
 * Handles required-features, info retrieval, and emits game-related events.
 */
export class GameEventsService extends EventEmitter {
  private _gepApi: overwolf.packages.OverwolfGameEventPackage;
  private _activeGame = 0;
  private _gepGamesId: number[] = [];

  constructor(gepApi: overwolf.packages.OverwolfGameEventPackage) {
    super();
    this._gepApi = gepApi;
  }

  /**
   * Register which game IDs we care about for GEP.
   */
  public registerGames(gepGamesId: number[]) {
    this._gepGamesId = gepGamesId;
  }

  /**
   * Enable the detected game and set the active game ID.
   * @param event - The GEP game launch event
   * @param gameId - The game ID
   */
  public async enableDetectedGame(
    event: overwolf.packages.GepGameLaunchEvent,
    gameId: number,
  ) {
    // Enables GEP for the game
    event.enable();
    this._activeGame = gameId;

    // Set required features for the game
    try {
      await this.setRequiredFeaturesForGame(gameId);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Reset the active game ID when the game exits.
   */
  public onGameExit() {
    this._activeGame = 0;
  }

  /**
   * Set required features for a specific game.
   * @param gameId - The game ID
   * @param features - The features to set (not used in this example)
   */
  private async setRequiredFeaturesForGame(
    gameId: number,
    features: string[] = [],
  ) {
    try {
      // In this example we are passing null to set all required features for the game.
      await this._gepApi?.setRequiredFeatures(gameId, null);
    } catch (error) {
      console.error(error);
    }
  }

  //------------------------------QA------------------------------------------
  /**
   * Get info payload for the currently active game.
   */
  public async getInfoForActiveGame(): Promise<any> {
    if (this._activeGame == 0) {
      return 'getInfo error - no active game';
    }

    try {
      const gameInfo = await this._gepApi.getInfo(this._activeGame);
      console.log(`getInfo for: ${this._activeGame}`, gameInfo);
      return gameInfo;
    } catch (error) {
      console.error(error);
      return 'getInfo error - no active game';
    }
  }

  /**
   * Set required features for all registered games.
   */
  public async setRequiredFeaturesForAllSupportedGames() {
    if (!this._gepApi) return;

    await Promise.all(
      this._gepGamesId.map(async (gameId) => {
        try {
          await this._gepApi.setRequiredFeatures(gameId, null);
        } catch (error) {
          console.error(error);
        }
      }),
    );

    console.log(
      `set-required-feature for games: ${this._gepGamesId.join(',')}`,
    );
  }
  //------------------------------QA------------------------------------------
}
