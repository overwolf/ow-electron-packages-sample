const settingsPageStyles = `
  .settings-section {

    .settings-options-list {
      overflow-x: auto;
      height: calc(100vh - 172px);
      display: flex;
      flex-direction: column;
      gap: 12px;
      list-style: none;
      padding-right: 32px;

      .settings-options-item {
        background-color: var(--color-surface-tertiary);

        &:has(.is-disabled) {
          background-color: rgb(48 48 48 / 40%);
        }

        .item-icon {
          width: 40px;
          height: 40px;
          color: var(--color-icon-secondary);
        }

        .option-info {
          text-align: left;

          h3 {
            font-size: var(--font-size-450);
            line-height: var(--font-line-height-700);
          }

          p {
            font-family: var(--font-family-default);
            color: var(--color-text-tertiary);
            font-size: var(--font-size-350);
            font-weight: var(--font-weight-regular);
            line-height: var(--font-line-height-500);
          }
        }

        &.simple-type, .settings-item-url, .expand-btn, &.is-disabled {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: var(--space-300) var(--space-400);
          width: 100%;
        }

        &.link-type {

          &:hover {
            background-color: var(--color-surface-tertiary-hover);
          }

          .settings-item-url {
            text-decoration: none;

            &:hover {
              color: unset;
            }
          }

        }

        &.expanded-type {

          &:hover {
            background-color: var(--color-surface-tertiary-hover);
          }

          .expand-btn {
            text-decoration: none;
          }

          .expanded-container {
            background-color: var(--color-surface-secondary);
            overflow: hidden;
            max-height: 1000px;
            transition: max-height 0.4s ease;
          }

        }

      }
    }
  }

  .cmp-settings {
    display: flex;
    align-items: center;
    gap: 12px;

    .cmp-notice {
      font-size: 12px;
    }
  }

  .overlay-settings, .hotkeys-settings, .display-settings {
    padding: var(--space-600);
  }

  .display-settings {
    select {
      min-width: 320px;
    }

    .display-info-grid {
      display: grid;
      grid-template-columns: max-content 1fr;
      gap: 6px 24px;
      margin: 16px 0 0;
      padding: 16px;
      background-color: var(--color-surface-primary);
      border-radius: 4px;

      dt {
        color: var(--color-text-tertiary);
        font-size: var(--font-size-350);
      }

      dd {
        font-size: var(--font-size-350);
        margin: 0;
      }
    }
  }

  .settings-title {
    font-size: var(--font-size-400);
    line-height: var(--font-line-height-600);
    margin-bottom: 12px;
  }

  .settings-sub-title {
    color: var(--color-text-primary);
    font-size: var(--font-size-350);
    font-weight: var(--font-weight-regular);
    line-height: var(--font-line-height-500);
    margin: 24px 0 12px;
  }

  .settings-row {
    margin-bottom: 12px;
    max-width: 525px;

    &.flex-row {
      max-width: 100%;
      display: flex;
      align-items: center;
      gap: var(--space-400);
      justify-content: space-between;

      .settings-input-item {
        max-width: 525px;
        width: -webkit-fill-available;
      }
    }
  }

  .settings-group {
    padding: var(--space-600);
    display: grid;
    grid-template-columns: 1fr 1fr;

    .left-col {
      padding-right: 50px;
      border-right: 1px solid var(--color-border-on-surface);
    }

     .right-col {
      padding-left: 50px;
    }

    .settings-input-item:not(:last-child) {
      margin-bottom: 12px;
    }

  }

  .settings-group-row-col-col {
    padding: var(--space-600);
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    grid-row-gap: 24px;
    grid-template-areas:
      "full-col full-col"
      "col-left col-right";

    .left-col {
      padding-right: 50px;
      border-right: 1px solid var(--color-border-on-surface);
      grid-area: col-left;
    }

    .right-col {
      padding-left: 50px;
      grid-area: col-right;
    }

    .settings-input-item:not(:last-child) {
      margin-bottom: 12px;
    }

    .settings-full-col {
      grid-area: full-col;
      border-bottom: 1px solid var(--color-border-on-surface);
      padding-bottom: 24px;
    }
  }

  .settings-input-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-300);

    &.no-justify-content {
      justify-content: unset;
      gap: 100px;
    }
  }

  .range-slider {
    width: 100%;

    .range-slider-inner {
      display: flex;
      align-items: center;
      gap: var(--space-400);
      min-height: 32px;
    }

    input[type="number"] {
      width: 80px;
    }
  }

  .radio-group {
    .radio-group-inner {
      display: flex;
      align-items: center;
      gap: var(--font-size-300);
    }
  }

  .number-input, .input-box {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;

    input {
      width: 320px;
      max-width: 100%;
    }
  }

  .output-directory {
    display: flex;
    gap: 8px;

    .input-box {
      flex: 1;

      label {
        white-space: nowrap;
      }

      input {
        width: 100%;
      }
    }
  }

  .recording-output {
    display: flex;

    .output-row {
      flex: 1;

      .displays {
        padding-left: 50px;
      }
    }
  }

  .show-more-options  {

    .show-more-btn {
      width: 100%;
      color: var(--color-text-primary);
      font-size: var(--font-size-350);
      font-weight: var(--font-weight-bold);
      line-height: var(--font-line-height-500);
      text-decoration: none;
      display: flex;
      justify-content: space-between;
      align-items: center;

      svg {
        width: 24px;
        height: 24px;
        color: var(--color-icon-secondary);
        transition: transform 300ms ease;
      }

      &:hover {
        color: inherit;

        svg {
          color: inherit;
        }
      }
    }

    .panel-collapsible {
      overflow: hidden;
      max-height: 0;
      transition: max-height 300ms ease;

      .panel-inner {
        padding: 12px 0;
      }
    }

    &.is-open {
      .show-more-btn {
        svg {
          transform: rotate(180deg);
        }
      }

      .panel-collapsible {
        max-height: 800px;
      }
    }

  }

  .more-actions {
    button {
      margin-right: 12px;
    }
  }

  .hotkey-width {
    input {
     width: 180px;
    }
  }
`;

export default settingsPageStyles;