import React from 'react';

interface ToggleSwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  labelText: string;
  className?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id,
  labelText,
  className = '',
  ...inputProps
}) => {

  return (
    <div className={`toggle-input ${className}`}>
      <input id={id} type="checkbox" hidden {...inputProps} />
      <label htmlFor={id}>
        {labelText && <span>{labelText}</span>}
        <b></b>
      </label>
    </div>
  );
};

export default ToggleSwitch;