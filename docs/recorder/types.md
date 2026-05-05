# ow-electron types Documentation

### CaptureSettingsOptions
- `videoEncoder?: kSupportedEncodersTypes` [kSupportedEncodersTypes](#ksupportedencoderstypes) - encoder type to create capture setting. use `Default` for the best default encoder detected (GPU -> x264)
- `audioEncoder?: kKnownAudioEncodersTypes` [kKnownAudioEncodersTypes](#kknownaudioencoderstypes) - Default is `ffmpeg_aac` (FFmpeg AAC) use queryInformation().encoders.audio for supported encoders
- `separateAudioTracks?: boolean` - When using the default audio sources, the Input and the Output audio sources, will use dedicate tracks (2, 3) as well as track number 1 will include both
- `includeDefaultAudioSources?: boolean` - Add Default input & output Audio Devices

### CaptureSettings
- The capture settings object is responsible of holding all of the options & configurations
required to start capture or replays, it contains the capture sources (video / audio) and the specific configurations related to them. as well as general recording options.
- Capture settings object is created using the `CaptureSettingsBuilder.build()` method
- The object is used as an argument to the `startRecording` & `startReplays` [methods](api-specification.md#methods)
Components:
  - `videoSettings: VideoSettings` - [Video Settings](#videosettings)
  - `audioSettings: AudioSettings` - [Audio Settings](#audiosettings)
  - `videoEncoderSettings: VideoEncoderSettingsBase`  - [Video Encoder Settings](#videoencodersettingsbase)
  - `audioEncoder: AudioEncoderInfo` - [Audio Encoder Info](#audioencoderinfo)
  - `sources: CaptureSource[]` - [Capture source](#capturesource)

### CaptureSettingsBuilder
`extends CaptureSettings`  The capture settings builder, is responsible of exposing
methods for preparing the `CaptureSettings` object, It allows the addition of capture sources, whether its a display / audio device or a game, as well as changing audio / video properties.
Once the settings are ready to be applied, use the `build()` method to create the `CaptureSettings` object
  - `addScreenSource(settings)` - Add Screen video capture source
      - param - [MonitorCaptureSourceSettings](#monitorcapturesourcesettings)
  - `addGameSource(settings)` - Add A Game video capture source
      - param - [GameCaptureSourceSettings](#gamecapturesourcesettings)
  - `addAudioCapture(params, settings)` - Add an Audio device to capture (Mic, Speakers, etc)
      - param - [AudioDeviceParams](#audiodeviceparams)
      - param - [AudioDeviceSettings](#audiodevicesettings)
  - `addAudioDefaultCapture(type, params, settings)` - Adds Default device (Input or Output) if not already added
      - param - type `'input' | 'output'`
      - param - [DefaultAudioDeviceParams](#defaultaudiodeviceparams)
      - param - [AudioDeviceSettings](#audiodevicesettings)
  - `addApplicationAudioCapture(params, settings)` - Add an Audio device to capture (Mic, Speakers, etc)
      - param - [ApplicationAudioCaptureParams](#applicationaudiocaptureparams)
      - param - [AudioDeviceSettings](#audiodevicesettings)
  - `build()` - Returns the CaptureSettings object, with all of the specific properties of the devices added using the methods above.


### RecordEventArgs
  - `filePath?: string | undefined` - Recording output file path
  - `error?: string` - Error message (optional)
  - `reason?: ErrorCode | number` - Error code (optional)
  - `stats?: RecorderStats` -  [Recording stats](#recorderstats)

### RecordStopEventArgs
 *(extends RecordEventArgs)
  - `duration?: number` - Video duration in milliseconds when recording ended successfully
  - `hasError: boolean`
  - `splitCount?: number` - number of splits (if had any)
  - `startTimeEpoch?: number`- Video start time (Epoch)


### SplitRecordArgs
 *(extends RecordEventArgs)
  - `duration?: number` - Video duration in milliseconds when recording ended successfully
  - `startTimeEpoch?: number`- Video start time (Epoch)
  - `splitCount?: number` - number of splits (if had any)
  - `nextFilePath: string` -  Next video file path

### ReplayVideo
  *(extends RecordEventArgs)
  - `duration?: number` - Video duration in milliseconds when recording ended successfully
  - `startTimeEpoch?: number`- Video start time (Epoch)


### RecorderStats
  - `cpuUsage: number` - Current CPU usage in percent
  - `memoryUsage: number` -  Amount of memory in MB currently being used by Recorder
  - `availableDiskSpace: number` - Available disk space on the device being used for recording storage
  - `activeFps: number` - Current FPS being rendered
  - `averageFrameRenderTime: number` -  Average time in milliseconds that Recorder is taking to render a frame
  - `renderSkippedFrames: number` - Number of frames skipped by Recorder in the render thread
  - `renderTotalFrames: number` - Total number of frames outputted by the render thread
  - `outputSkippedFrames: number` - Number of frames skipped by Recorder in the output thread
  - `outputTotalFrames: number` - Total number of frames outputted by the output thread

### RecordingAppOptions
  - `statsInterval?: number` -  note: set 0 to disable stats emit
  - `overrideOBSFolder?: string` -  Override OBS binaries
  - `customCommandLineArgs?: string[]` - Custom command lines when launching recorder
  - `enableDebugLogs?: boolean` - Enable recorder debug logs
  - `showDebugWindow?: boolean` - Show Recorder capture window

### RecordingInformation
  - `audio: AudioInformation` - [Audio Information](#audioinformation)
  - `video: VideoInformation` - [Video Information](#videoinformation)
  - `monitors: MonitorInfo[]` - [Monitor Info](#monitorinfo)


### AudioInformation
  - `inputDevices: AudioDevice[]` - [Audio Device](#audiodevice)
  - `outputDevices: AudioDevice[]`
  - `encoders: AudioEncoderInfo[]` - [Audio Encoder Info](#audioencoderinfo)

### VideoInformation
  - encoders: VideoEncoderInfo[] - [Video Encoder Info](#videoencoderinfo)
  - adapters: AdapterInfo[] - [Adapter Info](#adapterinfo)
  
### MonitorInfo
- `adapterIndex: number`
  - `id: string`
  - `altId: string`
  - `dpi: number`
  - `attachedToDesktop: boolean`
  - `friendlyName: string`
  - `refreshRate: number`
  - `rect: Rect`
  - `isPrimary: boolean`
  - `displayIndex: number`


### VideoEncoderInfo
  - `type: kSupportedEncodersTypes` - [kSupportedEncodersTypes](#ksupportedencoderstypes)
  - `properties` - Each supported encoder returns different associated properties
    -  `ffmpeg_aom_av1 & ffmpeg_svt_av1 will provide EncoderSettingsAMFAV1`
    -  `jim_hevc_nvenc - will provide  EncoderSettingsNVENCHEVC`
    -  `obs_qsv11_hevc & obs_qsv11_v2 - will provide EncoderSettingsQuickSyncHEVC`
    -  `obs_x264 - will provide EncoderSettingsX264`


### kSupportedEncodersTypes
  ```
  ffmpeg_svt_av1
  ffmpeg_aom_av1
  jim_nvenc
  jim_hevc_nvenc
  jim_av1_nvenc
  obs_x264
  h264_texture_amf
  h265_texture_amf
  av1_texture_amf
  obs_qsv11_v2
  obs_qsv11_hevc
  obs_qsv11_av1
  ```

### AdapterInfo
  - `index: 0`
  - `name: string`
  - `driver: string`
  - `hagsEnabled: boolean`
  - `hagsEnabledByDefault: boolean`


### AudioDevice
  - `type: AudioDeviceType`
  - `id: string`
  - `name: string`
  - `isDefault: boolean`

#### AudioEncoderInfo
  - `type: kKnownAudioEncodersTypes` - [kKnownAudioEncodersTypes](#kknownaudioencoderstypes)
  - `codec: string`
  - `name: string`

### kKnownAudioEncodersTypes
  ```
  'ffmpeg_aac' | 
  'ffmpeg_opus' | 
  'ffmpeg_pcm_s16le' |
  'ffmpeg_pcm_s24le' |
  'ffmpeg_pcm_f32le' |
  'ffmpeg_alac' |
  'ffmpeg_flac' |
  'string'
  ```

### kVideoColorFormat 
  ```
  'NV12' |
  'I420' |
  'I444' |
  'P010' |
  'I010' |
  'P216' |
  'P416' |
  'BGRA; 
  ```

### kVideoColorRange
```'Partial' | 'Full'```

### kVideoColorSpec
```
   'sRGB' |
   '709' |
   '601' |
   '2100PQ' |
   '2100HLG'
```

### VideoEncoderSettingsBase
  - `max_bitrate?: number` - The maximum allowed bitrate.
  - `bitrate?: number` - The encoding bitrate, Default is 8000
  - `keyint_sec?: number` - Key frames in second. Default is 0 (i.e auto, calculate by the recording engine more or less generate key frame every 4 second.).

### VideoSettings
  - `baseWidth: number` - Base width resolution. Default Half HD (main monitor ratio)
  - `baseHeight: number` - Base height resolution. Default Half HD (main monitor ratio)
  - `fps?: number` - Default is 30.
  - `outputWidth?: number`-  Output (scaled) resolution. Default is same as baseWidth
  - `outputHeight?: number`-  Output (scaled) resolution. Default is same as baseHeight
  - `colorFormat?: kVideoColorFormat` -Default is 'NV12'
  - `colorRange?: kVideoColorRange` - Default is '709'
  - `colorSpec?: kVideoColorSpec` -  Default is Partial
  - `sdrWhite?: number` - Default is 300 nits
  - `hdrPeak?: number` - Default is 1000 nits

### AudioSettings
  - `inputs: AudioDeviceSettingsInfo[]` - [AudioDeviceSettingsInfo](#audiodevicesettingsinfo)
  - `outputs: AudioDeviceSettingsInfo[]` - [AudioDeviceSettingsInfo](#audiodevicesettingsinfo)
  - `applications: ApplicationAudioDeviceSettingsInfo[]` - [ApplicationAudioDeviceSettingsInfo](#applicationaudiodevicesettingsinfo)


### Rect
```
top: number
left: number
width: number
height: number
```

### CaptureSource
  - `type: 'Display' | 'Game' | 'Window'`
  - `properties: any` - GameCaptureSourceSettings | MonitorCaptureSourceSettings

### GameCaptureSource
  - `type: 'Game`
  - `properties: GameCaptureSourceSettings`
  
### GameCaptureSource
  - `type: 'Display`
  - `properties: MonitorCaptureSourceSettings`

### GameCaptureSourceSettings
  - `gameProcess: string | number` - Game Process to capture, may contain the process name or process Id.
  - `sliCompatibility?: boolean` - Slow capture. using shared memory
  - `captureCursor?: boolean` - Capture mouse cursor. Default is true.
  - `allowTransparency?: boolean`
  - `premultipliedAlpha?: boolean`
  - `captureOverlays?: boolean` - Capture third-party overlays
  - `limitFramerate?: boolean`-  Limit capture framerate
  - `rgb10a2Space?: boolean` - Use Rec.2100 (PQ) color space instead sRGB

### MonitorCaptureSourceSettings
  - `monitorId: string`
  - `type?: DisplayCaptureType`
  - `captureCursor?: boolean` - Capture mouse cursor. Default is true.
  - `forceSDR?: boolean`

### CaptureSourceSettings
  -`stretchToOutputSize: boolean` - Streach
  
### AudioDeviceSettingsInfo
  *extends AudioDeviceSettings
  - `type: AudioDeviceType: 'input' | 'output'`
  - `id: string` - Device Id

### AudioDeviceSettings
  - `use_device_timing?: boolean`
  - `tracks?: AudioTracks`- include Device tracks. All tracks included by default
  - `balance?: number` -  0.0. - 1.0. Default is 0.5
  - `mono?: boolean` - Default is False (i.e stereo)
  - `volume?: number` - 0.0 - 20.0, default is 1.0 (100%)

### ApplicationAudioDeviceSettingsInfo
*extends AudioDeviceSettingsInfo
- `type: 'output'`


### DisplayCaptureType(enum)
 ```
  Auto = 0,
  DXGI = 1, // Direct Duplicator
  WGC = 2, // Windows 10 (1903 and up)
  BitBlt = 3, // Compatibility mode
 ```

### DefaultAudioDeviceParams
  `separateAudioTracks?: boolean` - Auto Separate audio tracks, When using the default audio sources, the Input and the Output audio sources, Will use dedicate tracks (2, 3), and track number 1 will include both
### AudioDeviceParams
*extends DefaultAudioDeviceParams
  
  - `id: string` - The device Id.
  - `name: string` - The device name

### ApplicationAudioCaptureParams
*extends DefaultAudioDeviceParams
  `processName: string` - Process name to capture audio from (i.e Discord.exe or minecraft.exe)

### SplitOptions
  - `enableManual: boolean` - Allow for manual split command to split the current running capture.
  - `maxTimeSecond?: number` - Split video by time (in seconds).

### RecordingBaseOptions
  - `fileFormat?: kFileFormat` - Video file format. Default is 'fragmented_mp4'
  - `audioTrack?: AudioTracks` - Video Audio tracks, default is 'Track1' or 'Track1'| 'Track2' |'Track3' if |separateAudioTracks| is on.
  - `autoShutdownOnGameExit?: boolean` -  Auto shutdown recording when game exit 
        **** Note: valid when recording with game capture source

### RecordingOptions
*extends RecordingBaseOptions
- `filePath: string` - Output file path (without file extension)
- `split?: SplitOptions` - [Split Options](#splitoptions)
- `maxBySizeMB?: number` -  Split video by size (MB).

### ReplayOptions
*extends RecordingBaseOptions
- `rootFolder: string` - Set the replay's root folder path, used when replays capture is initiated.
- `bufferSecond: number` - Defines the length of the buffer to be recorded in seconds

### CaptureReplayOptions
 - `fileName: string`- Replay file name (without extension)
 - `pastDuration: number` - The video length, in milliseconds to include prior to the time of this call.
 - `timeout?: number` - Auto stop (optional) in milliseconds. When set to Zero, will create replay with pass duration only. if not set, use |ActiveReplay| to stop the replay

#### ActiveReplay
  The active replay object is used to handle currently capturing replay, it can be used to stop, or prolong the replay as desired.
  - `timeout: number` - get current replay timeout in milliseconds (since was set, if was set)
  - `stop(callback)` - Stop replay now
      - param - ReplayCallback with [ReplayVideo](types.md#replayvideo)

  - `stopAfter(timeout, callback)` - Stop after |timeout| in milliseconds
      - param - `timeout: number` - time in ms to stop the replay capture
      - param - ReplayCallback with [ReplayVideo](types.md#replayvideo)


###  GameInfo
  - `id: number`
  - `classId: number`
  - `name: string`
  - `supported: boolean`
  - `processInfo?: GameProcessInfo`
  - `flags?: any`
  - `type: 'Game' | 'Launcher'`

###  GamesFilter
  - `all?: boolean` - Optional, when used pass empty [] for gameIds parameter
  - `includeUnsupported?: boolean` - Trigger on games that are not supported by ow-electron overlay api
  - `gamesIds: number[]` - list of desired gameIds.