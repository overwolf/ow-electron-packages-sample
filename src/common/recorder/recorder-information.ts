import { CaptureSettings, CaptureSettingsOptions, RecordingInformation, RecordingOptions, ReplayOptions } from "@overwolf/ow-electron-packages-types";

// common capture settings
export interface IRecorderInformation {
  information: RecordingInformation;

  recordingOptions: RecordingOptions;

  replaysOptions: ReplayOptions;

  captureSettings: CaptureSettings; // current capture settings

  captureSettingsOptions: CaptureSettingsOptions;
}