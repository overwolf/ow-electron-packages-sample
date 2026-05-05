import React from 'react';

interface AnyTypeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  labelText?: string;
  className?: string;
}

const AnyTypeInput: React.FC<AnyTypeInputProps> = ({
  id,
  labelText,
  className = '',
  type = 'text',
  ...inputProps
}) => {
  return (
    <div className={`input-box ${className}`}>
      <label htmlFor={id}>
        {labelText && <span>{labelText}</span>}
      </label>
      <input id={id} type={type} {...inputProps} />
    </div>
  );
};

export default AnyTypeInput;
