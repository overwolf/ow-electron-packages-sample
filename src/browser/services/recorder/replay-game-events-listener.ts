import { RecordingService } from './recording.service';

/**
 * ReplayGameEventsListener triggers replay capture for a configurable list of
 * games based on selected game event keys.
 */
export class ReplayGameEventsListener {
  private gameRunning = false;
  private readonly gameIds: Set<number>;
  private readonly features: Set<string>;

  constructor(
    private readonly recorderService: RecordingService,
    gameIds: number[],
    features: string[] = ['kill', 'death'],
  ) {
    this.gameIds = new Set(gameIds);
    this.features = new Set(features);
  }

  public async onGameLaunched(gameId: number) {
    if (!this.gameIds.has(gameId) || !this.recorderService.autoGameCapture) {
      return;
    }

    this.gameRunning = true;
    await this.recorderService.replaysTurnOn();
  }

  public async onGameExit(gameId: number) {
    if (!this.gameIds.has(gameId) || !this.gameRunning) {
      return;
    }

    this.gameRunning = false;
    await this.recorderService.onLolGameExit();
  }

  public async onNewEvent(event: any) {
    if (!this.features.has(event.key)) {
      return;
    }

    await this.recorderService.delayCapture();
  }
}
