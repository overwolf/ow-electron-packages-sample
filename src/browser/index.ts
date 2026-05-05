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
  const overlayController = new OverlayController();
  const gepController = new GameEventsController();
  // const gepService = gepController.service;
  const utilityService = new UtilityService();
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

const app = bootstrap();

ElectronApp.whenReady().then(() => {
  app.run();
});

ElectronApp.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    ElectronApp.quit();
  }
});

//-----------------------------------QA-----------------------------------------
// For "Electron App can launch a window with a timeout function"
// ElectronApp.whenReady().then(async () => {
//   setTimeout(() => {
//     app.run();
//   }, 10000);
// });
//-----------------------------------QA-----------------------------------------
