import React from 'react';

interface OnOffToggleSwitchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  isChecked: boolean;
  className?: string;
}

const OnOffToggleSwitch: React.FC<OnOffToggleSwitchProps> = ({
  id,
  isChecked,
  className = '',
  ...inputProps
}) => {
  return (
    <div className={`on-off-toggle-input ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={isChecked}
        hidden
        {...inputProps}
      />
      <label htmlFor={id}>
        <span>{isChecked ? 'On' : 'Off'}</span>
        <b></b>
      </label>
    </div>
  );
};

export default OnOffToggleSwitch;
