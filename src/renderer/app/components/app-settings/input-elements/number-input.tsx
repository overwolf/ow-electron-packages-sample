import React from 'react';

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  labelText: string;
  className?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({
  id,
  labelText,
  className = '',
  ...inputProps
}) => {

  return (
    <div className={`number-input ${className}`}>
      <label htmlFor={id}>
        {labelText && <span>{labelText}</span>}
      </label>
      <input id={id} type="number" {...inputProps} />
    </div>
  );
};

export default NumberInput;