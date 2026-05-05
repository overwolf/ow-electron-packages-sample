import React from 'react';
import themeTokens from './theme-tokens';
import resetStyles from './reset';
import overlayWindowHeaderStyles from './overlay-window-header';
import AdContainerStyles from './ad-container-styles';


const OverlayWindowStyles = () => (
  <style>
    {`
      ${themeTokens}
      ${resetStyles}
      ${overlayWindowHeaderStyles}
      ${AdContainerStyles}

      main {
        padding: 24px;
      }

      .overlay-window-title {
        color: var(--color-text-primary);
        font-size: var(--font-size-400);
        font-weight: var(--font-weight-bold);
        line-height: var(--font-line-height-600);
        margin-bottom: 8px;
      }

      .gep-logs-display {
        border: none;
        padding: var(--space-400);
        width: 100%;
        resize: none;
        font-family: Consolas, monospace;
        font-size: var(--font-size-350);
        font-weight: var(--font-weight-regular);
        line-height: var(--space-500);
      }

      .more-actions-button {
        padding: 12px 0;
        display: flex;
        flex-warp: warp;
        gap: 8px;
      }

      .overlay-window-settings {
        .overlay-settings-inner {
          padding: var(--space-400);
          background-color: var(--color-surface-secondary);
        }
      }

      .overlay-window-settings-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .overlay-label {
        color: var(--color-text-primary);
        font-size: var(--font-size-350);
        font-style: normal;
        font-weight: var(--font-weight-regular);
        line-height: var(--font-line-height-500);

        span {
          color: var(--color-text-tertiary);
        }
      }

      .overlay-window-wrapper {
        outline: 1px solid var(--color-border-quaternary);
        outline-offset: -1px;
      }

      .overlay-positions {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid var(--color-border-on-surface);

        .position-actions {
          margin-top: 12px;
          display: flex;

          button {
            flex: 1;
            border-color: var(--color-border-on-surface);

            &.is-active {
              border-color: var(--color-border-primary);
              background-color: var(--color-surface-on-surface-primary-hover);
              pointer-events: none;
            }
          }
        }
      }
    `}
  </style>
);

export default OverlayWindowStyles;