import { app as ElectronApp } from "electron";
import { Application } from "./application";
import { OverlayHotkeysService } from "./services/overlay-hotkeys.service";
import { OverlayService } from "./services/overlay.service";
import { GameEventsService } from "./services/gep.service";
import { MainWindowController } from "./controllers/main-window.controller";
import { DemoOSRWindowController } from "./controllers/demo-osr-window.controller";
import { OverlayInputService } from "./services/overlay-input.service";
import { RecordingService } from "./services/recording.service";
import { LolGameListener } from "./controllers/lol-events-listener";

/**
 * TODO: Integrate your own dependency-injection library
 */
const bootstrap = (): Application => {
  const overlayService = new OverlayService();
  const recordingService = new RecordingService();
  const overlayHotkeysService = new OverlayHotkeysService(overlayService);
  const gepService = new GameEventsService();
  const inputService = new OverlayInputService(overlayService);
  const lolListener = new LolGameListener(recordingService, gepService);

  const createDemoOsrWindowControllerFactory = (): DemoOSRWindowController => {
    const controller = new DemoOSRWindowController(overlayService);
    return controller;
  };

  const mainWindowController = new MainWindowController(
    gepService,
    overlayService,
    createDemoOsrWindowControllerFactory,
    overlayHotkeysService,
    inputService,
    recordingService,
    lolListener
  );

  return new Application(
    overlayService,
    gepService,
    recordingService,
    mainWindowController
  );
};

const app = bootstrap();

ElectronApp.whenReady().then(() => {
  app.run();
});

ElectronApp.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    ElectronApp.quit();
  }
});
