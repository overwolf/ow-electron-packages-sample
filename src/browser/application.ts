import { kGameIds } from '@overwolf/ow-electron-packages-types/game-list';
import { kGepSupportedGameIds } from '@overwolf/ow-electron-packages-types/gep-supported-games';
import { MainWindowController } from './controllers/main-window.controller';
// import { GameEventsService } from './services/gep/game-events.service';
import { GameEventsController } from './controllers/gep/game-events.controller';
import { OverlayController } from './controllers/overlay/overlay.controller';
import { RecordingController } from './controllers/recorder/recording.controller';
import { UtilityService } from './services/utility.service';
import { crashReporter } from 'electron'

export class Application {
  /**
   *
   */
  constructor(
    // private readonly overlayService: OverlayService,
    private readonly overlayController: OverlayController,
    private readonly gepController: GameEventsController,
    private readonly recordingController: RecordingController,
    private readonly utilityService: UtilityService,
    private readonly mainWindowController: MainWindowController,
  ) {
    overlayController.on('ready', this.onOverlayControllerReady.bind(this));
    gepController.on('ready', this.onGepControllerReady.bind(this));
    this.initializeCrashReporter();
  }

  /**
   * Runs the application.
   */
  public run() {
    this.initialize();
  }

  /**
   * Initializes the crash reporter (before app is ready)
   */
  private initializeCrashReporter() {
    crashReporter.start({
      //submitURL: 'https://overwolf.com/crash-reports',
      uploadToServer: false,
    });
  }

  /**
   * Initializes the main window and other components.
   */
  private initialize() {
    const showDevTools = true;
    this.mainWindowController.createAndShow(showDevTools);
  }

  /**
   * Fired when the overlay controller is ready.
   */
  private onOverlayControllerReady() {
    this.overlayController.registerToAllGames();
  }

  /**
   * Register games to the gep controller.
   * for gep supported games goto:
   * https://overwolf.github.io/api/electron/game-events/
   */
  private onGepControllerReady() {
    this.gepController.registerToGames([
      kGepSupportedGameIds.TeamfightTactics,
      kGameIds.DiabloIV,
      kGameIds.RocketLeague,
      kGameIds.PathofExile,
      kGameIds.VALORANT,
      kGameIds.Fortnite,
      kGameIds.Minecraft,
      kGameIds.LeagueofLegends,
      kGameIds.Dota2,
      kGameIds.CS2,
      kGameIds.Rainbow6Siege,
      kGepSupportedGameIds.TheFinals,
      kGepSupportedGameIds.OnceHuman,
      kGameIds.MarvelRivals,
      kGameIds.RobloxMicrosoftedition,
      21854,
    ]);
  }
}
