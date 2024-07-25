import { GameInfo, GameLaunchEvent } from '@overwolf/ow-electron-packages-types';
import { MainWindowController } from './controllers/main-window.controller';
import { OverlayService } from './services/overlay.service';
import { kGameIds } from "@overwolf/ow-electron-packages-types/game-list";
import { kGepSupportedGameIds } from '@overwolf/ow-electron-packages-types/gep-supported-games';
import { GameEventsService } from './services/gep.service';
import { RecordingService } from './services/recording.service';

export class Application {
  /**
   *
   */
  constructor(
    private readonly overlayService: OverlayService,
    private readonly gepService: GameEventsService,
    private readonly recordingService: RecordingService,
    private readonly mainWindowController: MainWindowController) {

    overlayService.on('ready', this.onOverlayServiceReady.bind(this));

    overlayService.on('injection-decision-handling', (
      event: GameLaunchEvent,
      gameInfo: GameInfo
    ) => {
      // Always inject because we tell it which games we want in
      // onOverlayServiceReady
      event.inject();
    })

    // for gep supported games goto:
    // https://overwolf.github.io/api/electron/game-events/
    gepService.registerGames([
      kGepSupportedGameIds.TeamfightTactics,
      kGameIds.DiabloIV,
      kGameIds.RocketLeague,
      kGameIds.PathofExile,
      kGameIds.VALORANT,
      kGameIds.Fortnite,
      kGameIds.Minecraft,
      kGameIds.LeagueofLegends,
      kGameIds.Dota2,
      kGameIds.CS2
    ]);
  }

  /**
   *
   */
  public run() {
    this.initialize();
  }

  /**
   *
   */
  private initialize() {
    const showDevTools = true;
    this.mainWindowController.createAndShow(showDevTools);
  }

  /**
   *
   */
  private onOverlayServiceReady() {
    // Which games to support overlay for
    this.overlayService.registerToGames([
      kGepSupportedGameIds.TeamfightTactics,
      kGameIds.DiabloIV,
      kGameIds.RocketLeague,
      kGameIds.PathofExile,
      kGameIds.VALORANT,
      kGameIds.Fortnite,
      kGameIds.Minecraft,
      kGameIds.LeagueofLegends,
      kGameIds.Dota2,
    ]);
  }
}
