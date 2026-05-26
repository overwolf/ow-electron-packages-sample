import React, { FC, useEffect, useState } from 'react';

interface DisplayInfo {
  id: number;
  label: string;
  width: number;
  height: number;
  scaleFactor: number;
  isPrimary: boolean;
  x: number;
  y: number;
  displayFrequency: number;
}

const DisplaySettings: FC = () => {
  const [displays, setDisplays] = useState<DisplayInfo[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    window.app.getDisplays().then(
      ({ displays: all, selectedDisplayId }: { displays: DisplayInfo[]; selectedDisplayId: number | null }) => {
        setDisplays(all);
        const initialId = selectedDisplayId ?? all.find((d) => d.isPrimary)?.id ?? null;
        setSelectedId(initialId);
      },
    );
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    setSelectedId(id);
    window.app.setWindowDisplay(id);
  };

  const selected = displays.find((d) => d.id === selectedId);

  const displayLabel = (d: DisplayInfo, index: number) => {
    const name = d.label || (d.isPrimary ? 'Primary Display' : `Display ${index + 1}`);
    return `${name} — ${d.width}×${d.height} @ ${Math.round(d.scaleFactor * 100)}%`;
  };

  return (
    <div className="display-settings">
      <div className="settings-input-item">
        <label htmlFor="display-select">Select display</label>
        <select
          id="display-select"
          value={selectedId ?? ''}
          onChange={handleChange}
        >
          {displays.map((d, i) => (
            <option key={d.id} value={d.id}>
              {displayLabel(d, i)}
            </option>
          ))}
        </select>
      </div>

      {selected && (
        <dl className="display-info-grid">
          <dt>Resolution</dt>
          <dd>{selected.width} × {selected.height} px</dd>

          <dt>Scale</dt>
          <dd>{Math.round(selected.scaleFactor * 100)}%</dd>

          {selected.displayFrequency > 0 && (
            <>
              <dt>Refresh rate</dt>
              <dd>{selected.displayFrequency} Hz</dd>
            </>
          )}

          <dt>Position</dt>
          <dd>{selected.x}, {selected.y}</dd>

          <dt>Primary</dt>
          <dd>{selected.isPrimary ? 'Yes' : 'No'}</dd>
        </dl>
      )}
    </div>
  );
};

export default DisplaySettings;
