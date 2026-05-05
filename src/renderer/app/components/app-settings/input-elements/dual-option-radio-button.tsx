import React from 'react';

type RadioOption<T extends string> = {
  value: T;
  label: string;
};

type DualOptionRadioProps<T extends string> = {
  name: string;
  label: string;
  options: RadioOption<T>[];
  selected: T;
  onChange: (value: T) => void;
};

export function DualOptionRadio<T extends string>({
  name,
  label,
  options,
  selected,
  onChange,
}: DualOptionRadioProps<T>) {
  return (
    <div className="radio-group">
      <h3 className='settings-title'>{label}</h3>
      
      <div className='radio-group-inner'>
        {options.map((opt, index) => {
          const id = `${name}-${opt.value}`;

          return (
            <div key={opt.value} className="radio-option">
              <input
                id={id}
                type="radio"
                name={name}
                value={opt.value}
                checked={selected === opt.value}
                onChange={() => onChange(opt.value)}
                hidden
              />
              <label htmlFor={id}>
                <b></b>
                <p><span>{opt.label}</span></p>
              </label>
            </div>
          );
        })}
      </div>

    </div>
  );
}
