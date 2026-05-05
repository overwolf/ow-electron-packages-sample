import React from 'react';
import themeTokens from './theme-tokens';
import resetStyles from './reset';
import headerStyles from './header';
import sideBarStyles from './sidebar';
import loggerPageStyles from './logger-page';
import adsTesterPageStyles from './ads-tester-page';
import settingsPageStyles from './settings-page';
import AdContainerStyles from './ad-container-styles';

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

        &:has(.settings-section) {
          padding-right: 0;
        }
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

        a {
          color: var(--color-text-tertiary);
          font-size: var(--font-size-600);
          font-weight: var(--font-weight-bold);
          line-height: var(--font-line-height-800);
          text-decoration: none;

          &:hover {
            color: inherit;
          }
        }
      }

    `}
  </style>
);

export default GlobalStyles;