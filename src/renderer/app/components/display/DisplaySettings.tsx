import React, { useEffect, useState } from 'react';

const DisplaySettings: React.FC = () => {
  const [displays, setDisplays] = useState<DisplayInfo[]>([]);
  const [moving, setMoving] = useState(false);

  const refresh = async () => {
    try {
      const result = await window.electronAPI.getDisplays();
      setDisplays(result);
    } catch (e) {
      console.error('[DisplaySettings] getDisplays error', e);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    const current = displays.find(d => d.isCurrent);
    if (!id || current?.id === id) return;

    setMoving(true);
    try {
      await window.electronAPI.moveToDisplay(id);
      await refresh();
    } catch (err) {
      console.error('[DisplaySettings] moveToDisplay error', err);
    } finally {
      setMoving(false);
    }
  };

  const current = displays.find(d => d.isCurrent);

  return (
    <div className='display-settings'>
      <select
        className='display-select'
        value={current?.id ?? ''}
        onChange={handleSelect}
        disabled={moving || displays.length <= 1}
        title={displays.length <= 1 ? 'Only one display detected' : 'Select a display to move the app to'}
      >
        {displays.map(d => (
          <option key={d.id} value={d.id}>
            {d.label}
          </option>
        ))}
      </select>
      {moving && <p className='display-moving-notice'>Moving…</p>}
      {displays.length <= 1 && (
        <p className='display-single-notice'>Only one display detected</p>
      )}
    </div>
  );
};

export default DisplaySettings;
