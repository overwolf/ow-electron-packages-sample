import React, { FC } from 'react';
import X264EncoderSettings from './encoder-settings/x264';
import NVENCHEVCEncoderSettings from './encoder-settings/nvenc-hevc';
import NVENCEncoderSettings from './encoder-settings/nvenc';
import AV1EncoderSettings from './encoder-settings/av1';
import QsHevcEncoderSettings from './encoder-settings/qs-hevc';

const CaptureVideoEncoderAdvancedSettings: FC = () => {
  return (
    <>
      <X264EncoderSettings />
      <NVENCHEVCEncoderSettings />
      <NVENCEncoderSettings />
      <AV1EncoderSettings />
      <QsHevcEncoderSettings />
    </>
  );
};
export default CaptureVideoEncoderAdvancedSettings;
