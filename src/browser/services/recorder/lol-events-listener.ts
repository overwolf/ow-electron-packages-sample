import { kGameIds } from '@overwolf/ow-electron-packages-types/game-list';
import { RecordingService } from './recording.service';

/**
 * LolGameListener is an example class of triggering replays capture
 * based on game events, which in this case is the `kill` and `death` events.
 */
export class LolGameListener {
  private gameRunning = false;
  private gameId = kGameIds.LeagueofLegends;
  private _features: string[] = ['kill', 'death'];

  constructor(private readonly recorderService: RecordingService) { }

  public async onGameLaunched(gameId: number) {
    if (gameId !== this.gameId || !this.recorderService.autoGameCapture) {
      return;
    }

    this.gameRunning = true;
    await this.recorderService.replaysTurnOn();
  }

  public async onGameExit(gameId: number) {
    if (gameId !== this.gameId || !this.gameRunning) {
      return;
    }

    this.gameRunning = false;
    await this.recorderService.onLolGameExit();
  }

  public async onNewEvent(event: any) {
    if (!this._features.includes(event.key)) {
      return;
    }

    await this.recorderService.delayCapture();
  }
}
