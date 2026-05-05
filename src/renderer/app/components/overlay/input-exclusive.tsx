import React, { ChangeEvent, FC, useContext, useEffect, useState } from 'react';
import { OverlayActions } from '../../api-actions/overlay-actions';
import RangeSlider from '../app-settings/input-elements/range-slider';
import { DualOptionRadio } from '../app-settings/input-elements/dual-option-radio-button';
import AppContext from '../../context/app-context';
import { ExclusiveInputOptions } from '@overwolf/ow-electron-packages-types';

type ExclusiveBehaviorTypes = 'Toggle' | 'AutoRelease';
type ExclusiveModeTypes = 'native' | 'customWindow';

// -----------------------------------------------------------------------------
const InputExclusive: FC = () => {
  const {
    changeOpacityValue,
    changeAnimationDurationValue,
    changeExclusiveBackgroundColor,
    changeExclusiveModeType,
    changeExclusiveHotkeyBehavior,
    exclusiveBackgroundColor,
    opacityValue,
    animationDuration,
    exclusiveModeType,
    exclusiveHotkeyBehavior,
  } = useContext(AppContext).overlaySettings;

  // ---------------------------------------------------------------------------
  const handleExclusiveBackgroundColorChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    // This function is already defined in the context, so we can use it directly
    changeExclusiveBackgroundColor(e);
  };
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  const handleOpacityValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    // This function is already defined in the context, so we can use it directly
    changeOpacityValue(e);
  };
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  const handleAnimationDurationValueChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    // This function is already defined in the context, so we can use it directly
    changeAnimationDurationValue(e);
  };
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  const handleExclusiveModeTypeChange = (value: ExclusiveModeTypes): void => {
    // This function is already defined in the context, so we can use it directly
    changeExclusiveModeType(value);
    OverlayActions.setExclusiveModeType(value);
  };
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  const handleExclusiveHotkeyBehaviorChange = (
    value: ExclusiveBehaviorTypes,
  ) => {
    // This function is already defined in the context, so we can use it directly
    changeExclusiveHotkeyBehavior(value);
    OverlayActions.setExclusiveModeHotkeyBehavior(value);
  };
  // ---------------------------------------------------------------------------

  const sendExclusiveOptions = () => {
    const r = parseInt(exclusiveBackgroundColor.slice(1, 3), 16);
    const g = parseInt(exclusiveBackgroundColor.slice(3, 5), 16);
    const b = parseInt(exclusiveBackgroundColor.slice(5, 7), 16);
    const a = opacityValue;

    const options: ExclusiveInputOptions = {
      backgroundColor: `rgba(${r},${g},${b},${a})`,
      fadeAnimateInterval: parseInt(animationDuration),
    };

    OverlayActions.updateNativeExclusiveModeOptions(options);
  };

  useEffect(() => {
    sendExclusiveOptions();
  }, [opacityValue, animationDuration, exclusiveBackgroundColor]);

  return (
    <div className="overlay-settings-inner">
      <h3 className="settings-title">Input Exclusive</h3>

      <div className="settings-row">
        <div className="settings-input-item color-picker">
          <label htmlFor="colorPicker">Background Color</label>
          <input
            type="color"
            value={exclusiveBackgroundColor}
            id="colorPicker"
            onChange={handleExclusiveBackgroundColorChange}
          />
        </div>
      </div>

      <div className="settings-row flex-row">
        <div className="settings-input-item">
          <RangeSlider
            label="Opacity"
            showNumberInput={true}
            rangeInputProps={{
              id: 'opacityRange',
              min: '0.0',
              max: '1.0',
              step: '0.1',
              value: opacityValue,
              onChange: handleOpacityValueChange,
            }}
            numberInputProps={{
              id: 'opacityValue',
              value: opacityValue,
              onChange: handleOpacityValueChange,
              step: '0.1',
            }}
          />
        </div>

        <div className="settings-input-item">
          <RangeSlider
            label="Animation Duration"
            showNumberInput={true}
            rangeInputProps={{
              id: 'animationDurationRange',
              min: '0',
              max: '1000',
              step: '10',
              value: animationDuration,
              onChange: handleAnimationDurationValueChange,
            }}
            numberInputProps={{
              id: 'animationDuration',
              value: animationDuration,
              onChange: handleAnimationDurationValueChange,
              step: '10',
            }}
          />
        </div>
      </div>

      <div className="settings-row">
        <div className="settings-input-item">
          <DualOptionRadio
            name="exclusiveMode"
            label="Exclusive Mode Type"
            selected={exclusiveModeType}
            onChange={handleExclusiveModeTypeChange}
            options={[
              { label: 'Native', value: 'native' },
              { label: 'Custom Window', value: 'customWindow' },
            ]}
          />

          <DualOptionRadio
            name="exclusiveHotkeyBehavior"
            label="Exclusive Mode Hotkey Behavior"
            selected={exclusiveHotkeyBehavior}
            onChange={handleExclusiveHotkeyBehaviorChange}
            options={[
              { label: 'Toggle', value: 'Toggle' },
              { label: 'Pressed', value: 'AutoRelease' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default InputExclusive;
