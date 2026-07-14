import { app as ElectronApp } from 'electron';
import { Application } from './application';
// import { GameEventsService } from './services/gep/game-events.service';
import { MainWindowController } from './controllers/main-window.controller';
import { RecordingController } from './controllers/recorder/recording.controller';
// import { LolGameListener } from './controllers/lol-events-listener';
import { UtilityService } from './services/utility.service';
import { OverlayController } from './controllers/overlay/overlay.controller';
import { GameEventsController } from './controllers/gep/game-events.controller';
/**
 * TODO: Integrate your own dependency-injection library
 */
const bootstrap = (): Application => {
  const recordingController = new RecordingController();
  const gepController = new GameEventsController();
  // const gepService = gepController.service;
  const utilityService = new UtilityService();
  const overlayController = new OverlayController(utilityService);
  // const lolListener = new LolGameListener(recordingService, gepService);

  const mainWindowController = new MainWindowController(
    // gepService,
    gepController,
    overlayController,
    utilityService,
    recordingController,
    // lolListener,
  );

  //-----------------------------------QA---------------------------------------
  // uncomment this line to disable ads optimization
  // ElectronApp.overwolf.disableAdsOptimization();

  // uncomment this line to disable anonymous analytics
  // ElectronApp.overwolf.disableAnonymousAnalytics();
  //-----------------------------------QA---------------------------------------

  return new Application(
    overlayController,
    gepController,
    recordingController,
    utilityService,
    mainWindowController,
  );
};

//-----------------------------------QA---------------------------------------
// OSR software-compositor white-frame repro: matches Electron's own
// https://www.electronjs.org/docs/latest/tutorial/offscreen-rendering example.
// Must be called before whenReady() - opt in via --test-osr-app-level-disable-gpu.
if (process.argv.includes('--test-osr-app-level-disable-gpu')) {
  ElectronApp.disableHardwareAcceleration();
}
//-----------------------------------QA---------------------------------------

const app = bootstrap();

ElectronApp.whenReady().then(() => {
  app.run();
});

ElectronApp.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    ElectronApp.quit();
  }
});

