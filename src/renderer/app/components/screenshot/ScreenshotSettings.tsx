import React, { useEffect, useState } from 'react';

const ScreenshotSettings: React.FC = () => {
  const [format, setFormat] = useState<'jpg' | 'bmp'>('jpg');

  useEffect(() => {
    window.electronAPI.getScreenshotFormat().then(setFormat).catch(console.error);
  }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as 'jpg' | 'bmp';
    setFormat(next);
    await window.electronAPI.setScreenshotFormat(next).catch(console.error);
  };

  return (
    <div className='display-settings'>
      <select className='display-select' value={format} onChange={handleChange}>
        <option value='jpg'>JPG</option>
        <option value='bmp'>BMP</option>
      </select>
    </div>
  );
};

export default ScreenshotSettings;
