import {
  kVideoColorRange,
  kVideoColorSpec,
  kVideoColorFormat,
  kFileFormat,
  AudioTracks,
  kX264EncoderPreset,
  kX264EncoderTune,
  kX264EncoderProfile,
  kAMDEncoderPresetAV1,
  kAMDEncoderRateControl,
  kNVENCEncoderRateControl,
  kQuickSyncEncoderRateControl,
  kNVENCEncoderTuning,
  kNVENCEncoderMultipass,
  kQuickSyncTargetUsage,
} from '@overwolf/ow-electron-packages-types';
import { AudioTracksEnum } from '../../../../common/recorder/audio-trackes-enum';

type FpsOption = 30 | 60 | 90 | 120;
export const fpsOptions: FpsOption[] = [30, 60, 90, 120];
export const VideoColorRange: kVideoColorRange[] = ['Partial', 'Full'];
export const VideoColorSpec: kVideoColorSpec[] = [
  'sRGB',
  '709',
  '601',
  '2100PQ',
  '2100HLG',
];
export const VideoColorFormatOptions: kVideoColorFormat[] = [
  'BGRA',
  'I010',
  'I420',
  'I444',
  'NV12',
  'P010',
  'P216',
  'P416',
];

export const outputFileFormat: kFileFormat[] = [
  'fragmented_mp4',
  'fragmented_mov',
  'mp4',
  'flv',
  'mkv',
  'mov',
  'mpegts',
  'hls',
];

export const audioSampleRate = [44100, 48000];
/**
 * None = 0
 * Track1 = 1
 * Track2 = 2
 * Track3 = 4
 * Track4 = 8
 * Track5 = 16
 * Track6 = 32
 * All = 0xff
 */
export const audioTracksArray = [
  AudioTracksEnum.Track1,
  AudioTracksEnum.Track2,
  AudioTracksEnum.Track3,
  AudioTracksEnum.Track4,
  AudioTracksEnum.Track5,
  AudioTracksEnum.Track6,
];

export const kAudioTracksMapping = {
  1: 'Track1',
  2: 'Track2',
  4: 'Track3',
  8: 'Track4',
  16: 'Track5',
  32: 'Track6',
} as const;

export const kX264EncoderPresetArray: kX264EncoderPreset[] = [
  'ultrafast',
  'superfast',
  'veryfast', // default
  'faster',
  'fast',
  'medium',
  'slow',
  'slower',
  'veryslow',
  'placebo',
];

export const kAMDEncoderPresetAV1Array: kAMDEncoderPresetAV1[] = [
  'quality',
  'balanced',
  'speed',
  'highQuality',
];

export const kX264EncoderTuneArray: kX264EncoderTune[] = [
  '',
  'film',
  'animation',
  'grain',
  'stillimage',
  'psnr',
  'ssim',
  'fastdecode',
  'zerolatency',
];

export const kX264EncoderProfileArray: kX264EncoderProfile[] = [
  '',
  'baseline',
  'main',
  'high',
];

export const kAMDEncoderRateControlArray: kAMDEncoderRateControl[] = [
  'CBR',
  'CQP',
  'VBR',
  'VBR_LAT',
  'QVBR',
  'HQVBR',
  'HQCBR',
];

// encoder NVENC
export const kNVENCEncoderRateControlArray: kNVENCEncoderRateControl[] = [
  'CBR',
  'CQP',
  'VBR',
  'Lossless',
];

export const kQuickSyncEncoderRateControlArray: kQuickSyncEncoderRateControl[] =
  ['CBR', 'CQP', 'VBR', 'ICQ'];

export const kNVENCEncoderTuningArray: kNVENCEncoderTuning[] = [
  'hq',
  'll',
  'ull',
];

export const kNVENCEncoderMultipassArray: kNVENCEncoderMultipass[] = [
  'qres',
  'fullres',
  'disabled',
];

export const kQuickSyncTargetUsageArray: kQuickSyncTargetUsage[] = [
  'TU1', // Slowest (Best Quality)
  'TU2', // Slower
  'TU3', // Slow
  'TU4', // Balanced (Medium Quality)
  'TU5', // Fast
  'TU6', // Faster
  'TU7', // Fastest (Best Speed)
];
