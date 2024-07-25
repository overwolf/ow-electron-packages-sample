import { kGameIds } from '@overwolf/ow-electron-packages-types/game-list';
import { RecordingService } from '../services/recording.service';
import { GameEventsService } from '../services/gep.service';

const kRequiredFeatures = ['kill', 'death'];
export class LolGameListener {
  private gameRunning = false;
  private gameId = kGameIds.LeagueofLegends;
  constructor(
    private readonly recorderService: RecordingService,
    private readonly gepService: GameEventsService,
  ) {}

  public async onGameLaunched(gameId: number) {
    if (gameId !== this.gameId || !this.recorderService.autoGameCapture) {
      return;
    }

    this.gepService.setRequiredFeaturesForGame(this.gameId, kRequiredFeatures);

    this.gameRunning = true;
    await this.recorderService.startReplays();
  }

  public async onGameExit(gameId: number) {
    if (gameId !== this.gameId || !this.gameRunning) {
      return;
    }

    this.gameRunning = false;
    await this.recorderService.stopReplays();
  }

  public async onNewEvent(event: any) {
    if (!kRequiredFeatures.includes(event.key)) {
      return;
    }

    this.recorderService.delayCapture();
  }

  public onNewInfo(info: any) {}
}
