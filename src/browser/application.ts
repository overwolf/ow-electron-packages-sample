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
    // Which games to support overlay for
    this.overlayController.registerToGames([
      kGameIds.LeagueofLegends,
      10902,
      kGameIds.AmericanTruckSimulator,
      kGameIds.ApexLegends,
      kGameIds.ARKSurvivalAscended,
      kGameIds.ARKSurvivalEvolved,
      kGameIds.BaldursGateIII,
      kGameIds.BlackMythWukong,
      kGameIds.CallofDutyModernWarfareII,      
      kGameIds.CallofDutyVanguard,
      kGameIds.ContentWarning,
      kGameIds.CS2,
      kGameIds.DarkandDarker,
      kGameIds.Deadlock,
      kGameIds.Diablo2Resurrected,
      kGameIds.DiabloIV,
      kGameIds.Dota2,
      kGameIds.ELDENRING,
      kGameIds.Enshrouded,
      kGameIds.EscapeFromTarkov,
      kGameIds.EternalReturnBlackSurvival,
      kGameIds.EuroTruckSim2,
      kGameIds.FinalFantasyXIVOnline,
      kGameIds.Fortnite,
      kGameIds.GenshinImpact,
      kGameIds.GTAV,
      kGameIds.HadesII,
      kGameIds.HaloInfinite,
      kGameIds.HearthstoneHeroesofWarcraft,
      kGameIds.HELLDIVERS2,
      kGameIds.HeroesoftheStorm,
      kGameIds.HonkaiStarRail,
      kGameIds.LeagueofLegendsPBE,
      kGameIds.LegendsofRuneterra,
      kGameIds.LethalCompany,
      kGameIds.LostArk,
      kGameIds.MagictheGatheringArena,
      kGameIds.ManorLords,
      kGameIds.Minecraft,
      kGameIds.MinecraftBedrock,
      kGameIds.NewWorld,
      kGameIds.OnceHuman,
      kGameIds.Osu,
      kGameIds.Overwatch,
      kGameIds.Palworld,
      kGameIds.PathofExile,
      kGameIds.PathofExile2,
      kGameIds.PUBG,
      kGameIds.Rainbow6Siege,
      kGameIds.Roblox,
      kGameIds.RobloxMicrosoftedition,
      kGameIds.RocketLeague,
      kGameIds.Rust,
      kGameIds.SonsoftheForest,
      kGameIds.SpectreDivide,
      kGameIds.SplitgateArenaWarfare,
      kGameIds.StarCraftII,
      kGameIds.Starfield,
      kGameIds.Stormgate,
      kGameIds.TeamfightTactics,
      kGameIds.TheFinals,
      kGameIds.TheFirstDescendant,
      kGameIds.TheSims4,
      kGameIds.Valheim,
      kGameIds.VALORANT,
      kGameIds.Warframe,
      kGameIds.Warhammer40000SpaceMarine2,
      kGameIds.WorldOfTanks,
      kGameIds.WorldofWarships,
      kGameIds.WoW,
      kGameIds.WoWClassic,
      kGameIds.WutheringWaves,
      kGameIds.XDefiant,
      kGameIds.MarvelRivals,
      1136,
      //kGameIds.GuildWars,
      kGameIds.GuildWars2,
    ]);
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
      21854,
    ]);
  }
}
