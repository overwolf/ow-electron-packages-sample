import React, { useState } from 'react';
import AnyTypeInput from '../app-settings/input-elements/any-type-input';

interface IHotkeyConfig {
  id: string;
  label: string;
  defaultBinding: string;
}

interface IHotkeyBindingDraft {
  keyCode: string | number;
  modifiers: {
    alt: boolean;
    ctrl: boolean;
    shift: boolean;
    custom: undefined;
    meta: boolean;
  };
}

/**
 * HotKeysSettings component allows users to configure hotkeys for various actions.
 * It provides an input field where users can set a hotkey by pressing the desired key combination.
 */
const HotKeysSettings = () => {
  // Demo hotkey configs, replace / fetch with actual hotkey you registered in the overlay package
  const hotkeyConfigs: IHotkeyConfig[] = [
    {
      id: 'show-hide-ingame',
      label: 'Show/Hide in-game window',
      defaultBinding: 'Ctrl+H',
    },
    {
      id: 'show-hide-all-windows',
      label: 'Show/Hide all windows',
      defaultBinding: 'Ctrl+G',
    },
    {
      id: 'toggle-exclusive-overlay-mode',
      label: 'Toggle Exclusive/Overlay Mode',
      defaultBinding: 'Alt+E',
    },
    {
      id: 'start-stop-recording',
      label: 'Start/Stop recording',
      defaultBinding: 'Ctrl+B',
    },
    {
      id: 'take-screenshot',
      label: 'Take screenshot',
      defaultBinding: 'Ctrl+Shift+S',
    },
  ];

  // Create state for all hotkeys dynamically
  const [hotkeys, setHotkeys] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    hotkeyConfigs.forEach((config) => {
      initial[config.id] = config.defaultBinding;
    });
    return initial;
  });

  // Generic handler that works for any hotkey
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const hotkeyId = e.currentTarget.id;
    if (!hotkeyId) return;

    const mods: string[] = [];

    if (e.ctrlKey && !mods.includes('Ctrl')) mods.push('Ctrl');
    if (e.altKey && !mods.includes('Alt')) mods.push('Alt');
    if (e.shiftKey && !mods.includes('Shift')) mods.push('Shift');
    if (e.metaKey && !mods.includes('Meta')) mods.push('Meta');

    const key = e.key;
    const ignoredKeys = ['Control', 'Alt', 'Shift', 'Meta'];

    if (!ignoredKeys.includes(key)) {
      const normalizedKey = normalizeKey(key);
      mods.push(normalizedKey);
      const hotkeyAsString = mods.join('+');

      // Update the state for this specific hotkey
      setHotkeys((prev) => ({
        ...prev,
        [hotkeyId]: hotkeyAsString,
      }));

      // Register the hotkey with the overlay API using the physical key code.
      hotkeyBuilder(hotkeyId, createHotkeyBinding(e));
      e.currentTarget.blur();
    }
  };

  const hotkeyBuilder = (
    hotkeyName: string,
    hotkeyBinding: IHotkeyBindingDraft,
  ) => {
    window.overlay.changeHotkey({
      name: hotkeyName,
      keyCode: hotkeyBinding.keyCode,
      modifiers: hotkeyBinding.modifiers,
    });
  };

  const createHotkeyBinding = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ): IHotkeyBindingDraft => {
    return {
      keyCode: e.code || e.key.toUpperCase().charCodeAt(0),
      modifiers: {
        alt: e.altKey,
        ctrl: e.ctrlKey,
        shift: e.shiftKey,
        custom: undefined,
        meta: e.metaKey,
      },
    };
  };

  const normalizeKey = (key: string) => {
    // Normalize function keys and symbols
    const specials: Record<string, string> = {
      ' ': 'Space',
      Escape: 'Esc',
      ArrowUp: 'Up',
      ArrowDown: 'Down',
      ArrowLeft: 'Left',
      ArrowRight: 'Right',
    };

    // Capitalize alpha keys
    if (key.length === 1) return key.toUpperCase();
    return specials[key] || key;
  };

  // Handler to clear the input on focus
  const handleFocus = (hotkeyId: string) => {
    setHotkeys((prev) => ({
      ...prev,
      [hotkeyId]: '',
    }));
  };

  return (
    <section className="hotkeys-settings">
      {hotkeyConfigs.map((config) => (
        <div className="settings-row" key={config.id}>
          <div className="settings-input-item">
            <AnyTypeInput
              id={config.id}
              className="hotkey-width"
              labelText={config.label}
              value={hotkeys[config.id]}
              readOnly
              onKeyDown={handleKeyDown}
              onFocus={() => handleFocus(config.id)}
            />
          </div>
        </div>
      ))}
    </section>
  );
};

export default HotKeysSettings;
