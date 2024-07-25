import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import InputSwitch from './input-switch';
import { OverlayActions } from '../api-actions/overlay-actions';

type HotKeyBehaviorTypes = 'toggle' | 'pressed';
type ExclusiveModeTypes = 'native' | 'customWindow';

// -----------------------------------------------------------------------------
const InputEXclusive: FC = () => {
  const [opacityValue, setOpacityValue] = useState('0.5');
  const [animationDuration, setAnimationDuration] = useState('100');
  const [colorPicker, setColorPicker] = useState('#0c0c0c');
  const [exclusiveTypeEnabled, setExclusiveType] =
    useState<ExclusiveModeTypes>('native');
  const [hotKeyType, setHotKeyEnabled] =
    useState<HotKeyBehaviorTypes>('toggle');

  const changeColorPicker = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value === colorPicker) {
      return;
    }

    setColorPicker(value);
  };

  const changeOpacityValue = (e: ChangeEvent<HTMLInputElement>) => {

    let value = parseInt(e.target.value) ? e.target.value: opacityValue ;
    if (value === opacityValue) {
      return;
    }

    setOpacityValue(value);
  };

  const animationDurationValue = (e: ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value) ? e.target.value: animationDuration ;
    if (value === animationDuration) {
      return;
    }

    setAnimationDuration(value);
  };

  const changeExclusiveType = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = e.target.checked;
    let returnV: ExclusiveModeTypes =
      value === true ? 'native' : 'customWindow';

    setExclusiveType(returnV);
    OverlayActions.setExclusiveModeType(returnV);
  };

  const changeHotkey = (e: ChangeEvent<HTMLInputElement>) => {
    let checked = e.target.checked;
    let returnValue: HotKeyBehaviorTypes =
      checked === true ? 'toggle' : 'pressed';

    setHotKeyEnabled(returnValue);
    OverlayActions.setExclusiveModeHotkeyBehavior(returnValue);
  };

  const sendExclusiveOptions = () => {
    const r = parseInt(colorPicker.substr(1, 2), 16);
    const g = parseInt(colorPicker.substr(3, 2), 16);
    const b = parseInt(colorPicker.substr(5, 2), 16);
    const a = opacityValue;

    const options = {
      color: `rgba(${r},${g},${b},${a})`,
      animationDuration: parseInt(animationDuration),
    };

    OverlayActions.updateExclusiveOptions(options);
  };

  useEffect(() => {
    sendExclusiveOptions();
  }, [opacityValue, animationDuration, colorPicker]);

  return (
    <div className="left-view">
      <h2>Input Exclusive:</h2>
      <div
        style={{
          width: '400px',
          height: '300px',
          border: '1px solid',
          background: 'transparent',
        }}
      >
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Background Color
          <input
            type="color"
            value={colorPicker}
            id="colorPicker"
            onChange={changeColorPicker}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          <div>Opacity</div>
          <input
            type="range"
            min="0.0"
            max="1.0"
            value={opacityValue}
            step="0.1"
            id="opacityRange"
            onChange={changeOpacityValue}
          />
          <input
            type="input"
            readOnly={false}
            value={opacityValue}
            id="opacityValue"
            onChange={changeOpacityValue}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          <div>Animation Duration</div>
          <input
            type="range"
            min="0"
            max="1000"
            value={animationDuration}
            step="10"
            id="animationDurationRange"
            onChange={animationDurationValue}
          />
          <input
            type="input"
            value={animationDuration}
            id="animationDuration"
            onChange={animationDurationValue}
          />
        </label>
        <InputSwitch
          title={'Exclusive Type'}
          onChange={changeExclusiveType}
          value={exclusiveTypeEnabled === 'native'}
          onText={'Native'}
          offText={'As Window'}
        />
        <br />
        <InputSwitch
          title={'Hotkey Behavior'}
          onChange={changeHotkey}
          value={hotKeyType === 'toggle'}
          onText={'toggle'}
          offText={'pressed'}
        />
      </div>
    </div>
  );
};

export default InputEXclusive;
