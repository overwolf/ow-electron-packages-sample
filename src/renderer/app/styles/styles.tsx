import React from 'react';
import themeTokens from './theme-tokens';
import resetStyles from './reset';
import headerStyles from './header';
import sideBarStyles from './sidebar';
import loggerPageStyles from './logger-page';
import adsTesterPageStyles from './ads-tester-page';
import settingsPageStyles from './settings-page';
import AdContainerStyles from './ad-container-styles';
import packageChannelsPageStyles from './package-channels-page';

const GlobalStyles = () => (
  <style>
    {`
      ${themeTokens}
      ${resetStyles}
      ${headerStyles}
      ${sideBarStyles}
      ${loggerPageStyles}
      ${adsTesterPageStyles}
      ${settingsPageStyles}
      ${AdContainerStyles}
      ${packageChannelsPageStyles}

      #root {
        height: 100%;
        display: grid;
        grid-template-areas:
          "header header"
          "sidebar main";
        grid-template-rows: 32px 1fr;
        grid-template-columns: 240px 1fr;
        height: 100vh;
      }

      .header {
        grid-area: header;
      }

      .main {
        grid-area: main;
        padding: var(--space-600) var(--space-800) var(--space-800);
        display: flex;
        flex-direction: column;
        min-height: 0;
        overflow: hidden;

        &:has(.settings-section) {
          padding-right: 0;
        }
      }

      .app-page {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
        overflow: hidden;
      }

      .sidebar {
        grid-area: sidebar;
      }

      .page-title {
        margin-bottom: 24px;

        .title-wrapper {
          display: flex;
          align-items: center;
          gap: var(--space-100);
          margin-bottom: 4px;
        }

        h2 {
          line-height: var(--font-line-height-800);
        }

        svg {
          width: 24px;
          height: 24px;
        }

        p {
          color: var(--color-text-tertiary);
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: var(--space-100);
          margin-bottom: 8px;
          color: var(--color-text-secondary);
          font-size: var(--font-size-350);
          font-weight: var(--font-weight-regular);
          text-decoration: none;

          .back-icon {
            transform: rotate(180deg);
          }

          &:hover {
            color: var(--color-text-primary);
          }
        }
      }

      .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .modal-dialog {
        background: var(--color-surface-primary);
        border: 1px solid var(--color-border-primary);
        border-radius: 8px;
        padding: 24px;
        width: 420px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .modal-title {
        font-size: var(--font-size-600);
        font-weight: var(--font-weight-semi-bold);
        color: var(--color-text-primary);
      }

      .modal-body {
        font-size: var(--font-size-400);
        color: var(--color-text-secondary);
        line-height: var(--font-line-height-500);
      }

      .modal-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
        margin-top: 8px;
      }
    `}
  </style>
);

export default GlobalStyles;
