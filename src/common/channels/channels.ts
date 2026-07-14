export const OverlayChannels = {
  TOGGLE_OSR_VISIBILITY: 'toggle-osr-visibility',
  REGISTER_HOTKEY: 'register-hotkey',
  UNREGISTER_HOTKEY: 'unregister-hotkey',
  UPDATE_HOTKEY: 'update-hotkey',
  PASSTHROUGH_RESET: 'passthrough-reset',
  ZORDER_RESET: 'zorder-reset',
  CREATE_IN_GAME_WINDOW: 'create-in-game-window',
  CREATE_IN_GAME_DPI_WINDOW: 'create-in-game-dpi-window',
  UPDATE_NATIVE_EXCLUSIVE_MODE_OPTIONS: 'update-native-exclusive-mode-options',
  SET_EXCLUSIVE_MODE_TYPE: 'set-exclusive-mode-type',
  SET_EXCLUSIVE_MODE_HOTKEY_BEHAVIOR: 'set-exclusive-mode-hotkey-behavior',
  ELEVATION_HELPER_PROMPT: 'elevation-helper-prompt',
  ELEVATION_HELPER_RESPONSE: 'elevation-helper-response',
} as const;

export const UtilityChannels = {
  GET_HIGH_ELEVATION_HELPER_STATUS: 'get-high-elevation-helper-status',
  INSTALL_HIGH_ELEVATION_HELPER: 'install-high-elevation-helper',
} as const;

export const PackageChannelIpcChannels = {
  GET_AVAILABLE:  'pkg-ch-get-available',
  GET_CURRENT:    'pkg-ch-get-current',
  GET_VERSIONS:   'pkg-ch-get-versions',
  SET:            'pkg-ch-set',
  RELAUNCH:       'pkg-ch-relaunch',
  READY:          'pkg-ch-ready',
  UPDATE_PENDING: 'pkg-ch-update-pending',
  GET_LOGS_FOLDER: 'pkg-ch-get-logs-folder',
  INIT_FAILED:    'pkg-ch-init-failed',
  GET_INIT_FAILURES: 'pkg-ch-get-init-failures',
} as const;
