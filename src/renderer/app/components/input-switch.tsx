import React, { ChangeEvent, FC } from 'react';

interface InputSwitchProps {
  title: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: boolean;
  onText: string;
  offText: string;
}

// -----------------------------------------------------------------------------
const InputSwitch: FC<InputSwitchProps> = ({
  title,
  onChange,
  value,
  onText,
  offText,
}) => {
  const checkedSliderBeforeStyle = {
    ...styles.sliderBeforeStyle,
    transform: value ? 'translateX(26px)' : 'translateX(0)',
    display: 'flex',
  };

  const checkedSliderStyle = {
    ...styles.sliderStyle,
    backgroundColor: value ? '#2196F3' : '#ccc',
    display: 'flex',
  };

  return (
    <div>
      <span> {title} </span>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginLeft: '10px' }}>{offText}</span>
        <label style={styles.switchStyle}>
          <input
            style={styles.inputStyle}
            type="checkbox"
            name="exclusiveType"
            checked={value}
            onChange={onChange}
          />
          <span style={checkedSliderStyle}>
            <span style={checkedSliderBeforeStyle}></span>
          </span>
        </label>
        <span>{onText}</span>
      </div>
    </div>
  );
};

const styles = {
  switchStyle: {
    position: 'relative' as 'relative',
    display: 'flex',
    width: '60px',
    height: '34px',
    marginLeft: '15px',
    marginRight: '15px',
  },
  inputStyle: {
    opacity: 0,
    width: 0,
    height: 0,
  },
  sliderBeforeStyle: {
    position: 'absolute' as 'absolute',
    content: '""',
    height: '26px',
    width: '26px',
    left: '4px',
    bottom: '4px',
    backgroundColor: 'white',
    transition: '.4s',
    borderRadius: '50%',
  },
  sliderStyle: {
    position: 'absolute' as 'absolute',
    cursor: 'pointer' as 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ccc',
    transition: '.4s',
    borderRadius: '34px',
  },
};

export default InputSwitch;
