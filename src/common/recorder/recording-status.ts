import { AudioEncoderInfo, AudioSettings, VideoEncoderSettingsBase, VideoSettings } from "@overwolf/ow-electron-packages-types";

/**
 * Service used to control The recording api,
 * capture displays and register to events from the recording api
 */
export type RecordingStatus = 'recording' |
  'stopped' |
  'replay' |
  'replay-capture';



export interface AdvancedCaptureSettings {
  captureGameSoundOnly?: boolean;

  videoSettings?: VideoSettings;

  audioSettings?: AudioSettings;

  videoEncoderSettings?: VideoEncoderSettingsBase;

  audioEncoder?: AudioEncoderInfo;
}