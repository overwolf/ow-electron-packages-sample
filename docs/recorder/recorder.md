# ow-electron Recording

This document will describe an example of implementing the ow-electron recording package, how to interact with its interfaces, types, and configurations.

[API Specification](api-specification.md)
[Types Definition](types.md)

## About the ow-electron recorder

The ow-electron recorder uses OBS behind the scenes and exposes OBS functions to the app. Using the recorder package, it is possible to record video and audio using the machine's devices, and running games.

## Recorder package features

### Capture Audio / Video

- Capture video from a specific display device or capture from a running game.
- Capture any audio input or output device, such as speakers, a microphone, or the game sound alone.
- Split capture into separate video files on-demand or using a timer.
- Multiple audio and video encoders supported.
- Multiple output formats supported.
- Control bitrate and encoding rate.
- Options to allocate specific audio tracks to specific audio devices.

### Replays Capture

- Record a buffer of X seconds to memory without saving to disk.
- Allow for on-demand video capture to disk with a portion or all of the in-memory buffer.
- For example, when a highlight is detected while the replay is running, capture can be turned on to run for a timer, using X seconds already captured by the replay.

### Game Listener

- Using the recording package, we can register for general events from supported games, such as game launch or exit.
- This can be used to trigger seamless recording as the game is loaded or alternately to start a replay and later trigger capture during appropriate moments.

### Usage stats

While the recorder is actively recording, usage stats are provided such as:

- CPU & memory usage
- Available disk space
- Active FPS
- Dropped frames information

## Getting started

### Installation

Make sure that the following node_modules are installed:

```shell
npm install @overwolf/ow-electron @overwolf/ow-electron-builder @overwolf/ow-electron-packages-types
```

> Currently, the recording api is in beta. To install the beta version use:
> `npm install @overwolf/ow-electron-packages-types@beta`
> Alternatively amend the beta package to your package.json and use `npm install` to update dependencies:

```json
...
  "devDependencies": {
    "@overwolf/ow-electron-packages-types": "beta",
  }
...
```

To activate the recording package, place the "recorder" string under \`overwolf -> packages\` in your app's \`package.json\`:

```
{
  ...
  "overwolf": {
    "packages": [
      "recorder"
    ]
},
  ...
}
```

### Recorder Usage

#### Import

```javascript
import { app as electronApp } from 'electron';
import { overwolf } from '@overwolf/ow-electron';
```

Import the app from 'electron' & overwolf from \`@overwolf/ow-electron\`.

#### Register

```javascript
const owElectronApp = electronApp as overwolf.OverwolfApp;
owElectronPackages.on('ready', (e, packageName) => {
    if (packageName === 'recorder') {
      console.log('Recorder package is loaded');
    }
});
```

Register to the ready state, and once the ready event is fired, verify that the package name is \recorder\.

```javascript
recorderApi.on('recording-started', (RecordEventArgs) => {
  console.log(RecordEventArgs.filePath);
});
```

Use event listeners to get notified by events. For more examples see: [Recording events](api-specification.md#events):

#### Query information

```javascript
// obtain OBS Information
const obsInfo = await recorderApi.queryInformation();

// Get default audio encoder
console.log(obsInfo.audio.defaultEncoder);

// Get audio input devices array
console.log(obsInfo.audio.inputDevices);

// Get audio output devices array
console.log(obsInfo.audio.outputDevices);

// Get videos displays array
console.log(obsInfo.video.adapters);

// Get default video encoder
console.log(obsInfo.video.defaultEncoder);

// Get available supported video encoders
console.log(obsInfo.video.encoders);

// Get available supported audio encoders
console.log(obsInfo.audio.encoders);
```

- Use the query information method to obtain information about the running machine:
  - Display devices
  - Audio Devices
  - Supported codecs etc

#### Start Recording - Simple

```javascript
async function startRecording(gameInfo: GameInfo = null) {
  try {
    // 1. create the default setting builder
    const settingsBuilder = await recorderApi.createSettingsBuilder({
      // with default audio (mic / desktop)
      includeDefaultAudioSources: true,
    });

    /* changing default video settings
       settingsBuilder.videoSettings.fps = 60;
       settingsBuilder.videoSettings.baseWidth  = 1920;
       settingsBuilder.videoSettings.baseHeight = 1080;
     */

    // 2. do we want to capture game or display?
    if (gameInfo) {
      // game capture
      settingsBuilder.addGameSource({
        gameProcess: gameInfo.processInfo.pid, // or just 'Game.exe' name
        captureOverlays: true, // capture overlay windows
      });
    } else {
      // desktop capture
      // |monitorId| from '''queryInformation()'''
      settingsBuilder.addScreenSource({ monitorId });
    }

    // 3. Build the capture settings using the `build()` **method**
    const captureSettings = settingsBuilder.build();

    const outputFolder = path.join(app.getPath('videos'), app.name);

    const fileName = game?.name ?? 'display';

    // 4. Set the recording options
    const recordingOptions: RecordingOptions = {
      // note: if filepath already exits, it will override it.
      filePath: path.join(outputFolder, 'MyRecording'),
      autoShutdownOnGameExit: false, // when 'true' on game process exit, the recording will stop automatically
      fileFormat: 'mp4',
    };

    // 5. Start recording
    await recorderApi.startRecording(
      recordingOptions,
      captureSettings,
      (stopResult) => {
        // also can be handled at 'recording-stopped'
        console.log('Recording stopped ', stopResult);
      },
    );

    // we can start replay's also here...
  } catch (err) {
    console.log('Error while starting recording', err);
  }
}
```

1. Create the capture settings options object.
2. add capture source
3. Use the capture settings options object to create the settings builder.
4. Build the capture settings using the `build()` method
5. Set the recording options
6. Start recording

#### Stop Recording

```javascript
async function stopRecording() {
  try {
    const active = await recorderApi.isActive();
    if (!active) {
      return;
    }

    // stop recording
    await recorderApi.stopRecording((recordStopEventArgs) => {
      console.log(recordStopEventArgs.duration);
    });
  } catch (err) {
    console.log('Error while stopping recording', err);
  }
}
```

1. Before attempting to stop the capture directly, we can use the `isActive()` method to check if the capture is active.
2. Once we know the recording is active, We can call the `stopRecording()` method, include the optional callback to obtain details about the stopped capture.

#### Change Capture Sources

- Once we have the settingsBuilder object we can use it to select specific capture sources:

##### Add Game Source:

```javascript
const settingsBuilder = await recorderApi.createSettingsBuilder(
  captureSettingsOptions,
);
const gameProcessId = 45623; // example process Id, Obtain process Id by registering to game listeners.

// sets the game with process id 45623 to be the source of the recording.
settingsBuilder.addGameSource({ gameProcess: gameProcessId });

// Build the capture settings using the `build()` **method**
const captureSettings = settingsBuilder.build();
```

##### Add Display Source:

```javascript
const settingsBuilder = await recorderApi.createSettingsBuilder();
// Example display Id, Obtain machine displays by using the queryInformation() method
const displayAltId = 'my_display_id';

// Sets the display id to be the source of the recording.
settingsBuilder.addScreenSource({ monitorId: displayAltId });

// Build the capture settings using the `build()` **method**
const captureSettings = settingsBuilder.build();
```

##### Add Audio Default source:

```javascript
const settingsBuilder = await recorderApi.createSettingsBuilder(
 includeDefaultAudioSources: false,
);

// Sets the Default output audio device as the audio source for the recording,
// for example speakers or headphones.
// Any sound coming from this device will be recorded.
settingsBuilder.addAudioDefaultCapture('output');

// Alternatively you can use the default input device, like a microphone.
// settingsBuilder.addAudioDefaultCapture('input')

// Alternatively set other device ( Obtain devices from queryInformation() method)
// settingsBuilder.addAudioCapture({id: the_device_id, name: "my device"})

// Build the capture settings using the `build()` **method**
const captureSettings = settingsBuilder.build();
```

#### Replays & Capture

##### Start Replay

```javascript
async function startReplays() {}
    try {
      // Create the capture settings options object.
      const captureSettingsOptions: CaptureSettingsOptions = {
        includeDefaultAudioSources: true,
      }
      // Build the capture settings using the build() method
      const settings =
        await recorderApi.createSettingsBuilder(captureSettingsOptions);

      // set key frame every 1 second for more accurate stop timestamp;
      // note: this require more resource from the recording engine
      // settings.videoEncoderSettings.keyint_sec = 1;

      const settingsCapture = settings.build();

      const outputFolder = path.join(app.getPath('videos'), app.name, 'replays');
      // Set the replays options
      const replaysOptions: ReplayOptions = {
         bufferSecond: 30,
         rootFolder: outputFolder
         fileFormat: 'mp4',
      }

      // Start replays
      await recorderApi.startReplays(
        replaysOptions,
        // if recording (i.e start recording) is already on, settingsCapture is not mandatory
        settingsCapture,
      );

    } catch (err) {
      console.error('START replay ERROR', err);
    }
```

1. Create the capture settings options object.
2. Use the capture settings options object to create the settings builder.
3. Build the capture settings using the build() method
4. Set the replays options
5. Start Replays

##### Start Capturing Replays

```javascript
async function startCaptureReplay() {
  try {
    const fileName = `MyReplay-${timestemp()}`; // probely
    // Create the replay Capture Options object.
    const replayCaptureOptions: CaptureReplayOptions = {
      fileName: 'replay-capture',
      pastDuration: 30000,
      // timeout: 10000 // stop the replay in 10 second
    };

    // Use the replay capture options to start the capture replay.
    // The captureReplay method returns the activeReplay,
    // we can use it to control the capturing
    const activeReplay = await recorderApi.captureReplay(
      replayCaptureOptions,
      (video) => {
        console.log('replay video ready ', video);
        // Once the captureReplay callback is returned we set the activeReplay
        // as undefined to indicate that the replay capture is done.
        activeReplay = undefined;
      },
    );
  } catch (error) {
    console.error('Error starting capture replay', error);
  }
}
```

1. Create the replay Capture Options object.
2. Use the replay capture options to start the capture replay.
3. The captureReplay method returns the activeReplay, we can use it to control the capturing replay.
4. Once the captureReplay callback is returned we set the activeReplay as undefined to indicate that the replay capture is done.

##### Extend Capture Replay

```javascript
// Check activeReplay is not undefined, which means the capture replay is currently recording.
if (!activeReplay) {
  return;
}

// Obtain how long remains in ms until the timeout, and the capture is stopped.
console.log(activeReplay.timeout);

// Stop capture replay after 10000ms
activeReplay.stopAfter(10000);
```

- While the capture replay is running we can extend it's timeout by using the activeReplay object

##### Stopping Capture Replay

```javascript
// Stop capture replay immediately
activeReplay.stop();
```
