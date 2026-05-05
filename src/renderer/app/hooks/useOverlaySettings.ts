import { useState, ChangeEvent } from 'react';

export function useOverlaySettings() {
  //----------------------------------------------------------------------------
  const [exclusiveBackgroundColor, setExclusiveBackgroundColor] =
    useState('#0c0c0c');

  const changeExclusiveBackgroundColor = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value !== exclusiveBackgroundColor) setExclusiveBackgroundColor(value);
  };
  //----------------------------------------------------------------------------

  //----------------------------------------------------------------------------
  const [opacityValue, setOpacityValue] = useState('0.5');

  const changeOpacityValue = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsed = parseFloat(value);
    if (value === '') {
      setOpacityValue('');
    } else if (value !== opacityValue && parsed >= 0 && parsed <= 1) {
      setOpacityValue(value);
    } else {
      console.warn('Opacity value must be between 0 and 1');
    }
  };
  //----------------------------------------------------------------------------

  //----------------------------------------------------------------------------
  const [animationDuration, setAnimationDuration] = useState('100');

  const changeAnimationDurationValue = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsed = parseInt(value);
    if (value === '') {
      setAnimationDuration('');
    } else if (value !== animationDuration && parsed >= 0 && parsed <= 1000) {
      setAnimationDuration(value);
    } else {
      console.warn('Animation duration must be between 0 and 1000');
    }
  };
  //----------------------------------------------------------------------------

  //----------------------------------------------------------------------------
  const [exclusiveModeType, setExclusiveModeType] = useState('native');

  const changeExclusiveModeType = (value: string) => {
    if (value !== exclusiveModeType) {
      setExclusiveModeType(value);
    }
  };
  //----------------------------------------------------------------------------

  //----------------------------------------------------------------------------
  const [exclusiveHotkeyBehavior, setExclusiveHotkeyBehavior] =
    useState('Toggle');

  const changeExclusiveHotkeyBehavior = (value: string) => {
    if (value !== exclusiveHotkeyBehavior) {
      setExclusiveHotkeyBehavior(value);
    }
  };
  //----------------------------------------------------------------------------

  return {
    exclusiveBackgroundColor,
    opacityValue,
    animationDuration,
    exclusiveModeType,
    exclusiveHotkeyBehavior,
    changeExclusiveBackgroundColor,
    changeOpacityValue,
    changeAnimationDurationValue,
    changeExclusiveModeType,
    changeExclusiveHotkeyBehavior,
  };
}
