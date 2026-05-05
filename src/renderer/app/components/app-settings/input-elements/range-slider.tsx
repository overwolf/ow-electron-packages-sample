import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

interface RangeSliderProps {
  label?: string;
  title?: string;
  showNumberInput?: boolean;
  rangeInputProps: InputProps;
  numberInputProps?: InputProps;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  label,
  title,
  showNumberInput = false,
  rangeInputProps,
  numberInputProps,
}) => {
  const min = parseFloat(rangeInputProps.min?.toString() ?? '0');
  const max = parseFloat(rangeInputProps.max?.toString() ?? '100');
  const value =
    typeof rangeInputProps.value === 'number'
      ? rangeInputProps.value
      : parseFloat(
          rangeInputProps.value?.toString() ??
            rangeInputProps.defaultValue?.toString() ??
            '0',
        );

  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="range-slider" title={title ? title : ''}>
      {label && rangeInputProps.id && (
        <label htmlFor={rangeInputProps.id}>{label}</label>
      )}

      <div className="range-slider-inner">
        <input
          type="range"
          {...rangeInputProps}
          style={{
            ...(rangeInputProps.style || {}),
            ['--value' as any]: `${percent}`,
          }}
        />

        {showNumberInput && <input type="number" {...numberInputProps} />}
      </div>
    </div>
  );
};

export default RangeSlider;
