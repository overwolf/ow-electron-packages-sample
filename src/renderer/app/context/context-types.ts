import {
  VideoEncoderSettingsBase,
  EncoderSettingsAMF,
  EncoderSettingsNVENC,
  EncoderSettingsQuickSync,
  EncoderSettingsQuickSyncH264,
  EncoderSettingsX264,
  CaptureSettings,
} from '@overwolf/ow-electron-packages-types';

export type UiVideoEncoderSettings =
  | VideoEncoderSettingsBase
  | EncoderSettingsNVENC
  | EncoderSettingsX264
  | EncoderSettingsAMF
  | EncoderSettingsQuickSync
  | EncoderSettingsQuickSyncH264;

export interface UiCaptureSettings extends CaptureSettings {
  videoEncoderSettings: UiVideoEncoderSettings;
}

export interface AvailablePackages {
  availablePackages?: string[];
  isPackageAvailable?: (packageName: string) => boolean;
}