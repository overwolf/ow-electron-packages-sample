
# API Specification

## Properties

- `options`: Contains global options for debugging [RecordingAppOptions](types.md#recordingappoptions)

## Methods

> **Important:** It is recommended to wrap the methods in a try/catch block to handle any possible exceptions from the recording API.

- `isActive()`: Checks if recording or replays status is active.
    ```javascript
    const active = await recorderApi.isActive();
    ```

- `queryInformation()`: Queries system information, including supported encoders and available audio/video devices and monitors.
    ```javascript
    const info = await recorderApi.queryInformation();
    console.log(info.monitors);
    ```

- `registerGames(filter)`: Registers game launches, triggering the `game-launched` event for detected processes. Accepts the [GamesFilter](types.md#gamesfilter) object.
    ```javascript
    const gamesFilter = {
      gameIds: [1111, 2222], // use [] for all games
    };
    recorderApi.registerGames(gamesFilter);
    ```

- `createSettingsBuilder(options)`: Creates the [Settings Builder](types.md#capturesettingsbuilder) object.
    - Parameters: [CaptureSettingsOptions](types.md#capturesettingsoptions)

- `startRecording(options, setting, listener)`: Starts recording based on provided settings.
    - Parameters:
        - [RecordingOptions](types.md#recordingoptions)
        - [CaptureSettings](types.md#capturesettings)
        - StopCallback with [RecordStopEventArgs](types.md#recordstopeventargs)

- `stopRecording(listener)`: Stops the recording.
    - Parameters: StopCallback with [RecordStopEventArgs](types.md#recordstopeventargs)

- `splitRecording(listener)`: Manually splits the video at the moment of calling the method, creating a subfolder in the current output directory for the split videos.
    - Parameters: SplitCallback with [SplitRecordArgs](types.md#splitrecordargs)

## Events

- `recording-started`: Fired when video recording starts. Returns StartCallback with [RecordEventArgs](types.md#recordeventargs).
    ```javascript
    recorderApi.on('recording-started', (RecordEventArgs) => {
      console.log(RecordEventArgs.filePath);
    });
    ```

- `recording-stopped`: Fired when video recording stops. Returns StopCallback with [RecordStopEventArgs](types.md#recordstopeventargs).
    ```javascript
    recorderApi.on('recording-stopped', (RecordStopEventArgs) => {
      console.log(RecordStopEventArgs.duration);
    });
    ```

- `recording-split`: Fired when a recording video is split (manual/size/time). Returns SplitCallback with [SplitRecordArgs](types.md#splitrecordargs).
    ```javascript
    recorderApi.on('recording-split', (SplitRecordArgs) => {
      console.log(SplitRecordArgs.splitCount);
    });
    ```

- `replays-started`: Fired when replays recording starts. Returns StartCallback with [RecordEventArgs](types.md#recordeventargs).
    ```javascript
    recorderApi.on('replays-started', (RecordEventArgs) => {
      console.log(RecordEventArgs.filePath);
    });
    ```

- `replays-stopped`: Fired when replays recording stops. Returns ReplayStopCallback with [RecordEventArgs](types.md#recordeventargs).
    ```javascript
    recorderApi.on('replays-stopped', (RecordEventArgs) => {
      console.log(RecordEventArgs.filePath);
    });
    ```

- `replay-captured`: Fired when a replay video is captured. Returns ReplayCallback with [ReplayVideo](types.md#replayvideo).
    ```javascript
    recorderApi.on('replay-captured', (ReplayVideo) => {
      console.log(ReplayVideo.duration);
    });
    ```

- `stats`: Fired at every `statsIntervalMS` (defined in RecordingAppOptions) interval. Returns [RecorderStats](types.md#recorderstats).
    ```javascript
    recorderApi.on('stats', (RecorderStats) => {
      console.log(RecorderStats.cpuUsage);
    });
    ```
