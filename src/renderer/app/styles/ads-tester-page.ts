const adsTesterPageStyles = `
  .ads-tester-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .logger-and-actions {
      display: flex;
      justify-content: space-between;
      gap: 16px;

      .tester-logs-display {
        border: none;
        padding: var(--space-400);
        width: 400px;
        resize: none;
        font-family: Consolas, monospace;
        font-size: var(--font-size-350);
        font-weight: var(--font-weight-regular);
        line-height: var(--space-500);
      }
    }

    .layout-actions {
      display: flex;
      gap: 16px;
      align-items: center;

      .select-layout {
        display: flex;
        align-items: center;
        gap: var(--space-300);
        padding-right: 16px;
        border-right: 1px solid var(--color-border-on-surface);

        select {
          width: 240px;
        }

        label {
          flex: none;
        }
      }
    }

    .app-layout-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: var(--color-surface-secondary);

      &.high-impact-expanded {
        /* Expand container for high impact ads */
        position: relative;
        z-index: 10;
      }

      .app-layout-header {
        background-color: var(--color-surface-tertiary);
        padding: 0px 8px 0px var(--space-200);
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 28px;

        .electron-logo {
          width: 92px;
          height: 14px;
        }

        .fake-icons {
          width: 53px;
          height: 8px;
        }
      }

      .app-layout-main {
        flex: 1;
        display: grid;

        .left-col, .right-col {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--color-surface-primary);
          padding: 24px 0;
        }

        .main-area {
          background-image: var(--icon-empty);
          background-position: center center;
          background-size: 118px;
          background-repeat: no-repeat;
        }

        &.tall-duo-right {
          grid-template-columns: 196px 1fr 436px;
        }

        &.tall-duo-left {
          grid-template-columns: 436px 1fr 196px;
        }

        &.combo-classic-right {
          grid-template-columns: 336px 1fr 436px;

          .left-col { 
            align-items: flex-end;
          }
        }

        &.combo-classic-left {
          grid-template-columns: 436px 1fr 336px;

          .right-col {
            align-items: flex-end;
          }
        }

        &.studio-tower-right {
          grid-template-columns: 196px 1fr 336px;

          .right-col {
            align-items: flex-end;
          }
        }

          &.studio-tower-left {
            grid-template-columns: 336px 1fr 196px;

            .left-col {
              align-items: flex-end;
            }
        }

        &.tower-right {
          grid-template-columns: 1fr 436px;
          grid-template-rows: 2fr 138px;
          grid-template-areas:
            "center right"
            "left right";

          .left-col {
            grid-area: left;
          }

          .main-area {
            grid-area: center;
          }

          .right-col {
            grid-area: right;
          }
        }

        &.tower-left {
          grid-template-columns: 436px 1fr;
          grid-template-rows: 2fr 138px;
          grid-template-areas:
            "left center"
            "left right";

          .left-col {
            grid-area: left;
          }

          .main-area {
            grid-area: center;
          }

          .right-col {
            grid-area: right;
          }
        }

        &.tower-plus-right {
          grid-template-columns: 1fr 440px;

          .main-area {
            grid-area: auto;
          }

          .ad-zone-right {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-evenly;
            background-color: var(--color-surface-primary);
            min-height: 670px;
            min-width: 440px;
          }
        }

        &.tower-plus-left {
          grid-template-columns: 440px 1fr;

          .main-area {
            grid-area: auto;
          }

          .ad-zone-left {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: var(--color-surface-primary);
            min-height: 670px;
            min-width: 440px;
          }
        }

        &.tower-plus-high-impact {
          grid-template-columns: 1fr 440px;

          .main-area {
            grid-area: auto;
          }

          .ad-zone-right {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-evenly;
            background-color: var(--color-surface-primary);
            min-height: 670px;
            min-width: 440px;
          }
        }

        &.studio-right {
          grid-template-columns: 1fr 436px;
          grid-template-rows: 1fr 138px;
          grid-template-areas:
            "center right"
            "left right";

          .left-col {
            grid-area: left;
          }

          .main-area {
            grid-area: center;
          }

          .right-col {
            grid-area: right;
            align-items: flex-end;
          }
        }

        &.studio-left {
          grid-template-columns: 436px 1fr;
          grid-template-rows: 1fr 138px;
          grid-template-areas:
            "left center"
            "left right";

          .left-col {
            grid-area: left;
            align-items: flex-end;
          }

          .main-area {
            grid-area: center;
          }

          .right-col {
            grid-area: right;
          }
        }

        &.studio-plus-right {
          grid-template-columns: 1fr 436px;
          grid-template-rows: 1fr 1fr;
          grid-template-areas:
            "center left"
            "center right";

          .left-col {
            grid-area: left;
            align-items: flex-start;
          }

          .main-area {
            grid-area: center;
          }

          .right-col {
            grid-area: right;
            align-items: flex-end;
          }
        }

        &.studio-plus-left {
          grid-template-columns: 436px 1fr;
          grid-template-rows: 1fr 1fr;
          grid-template-areas:
            "left center"
            "right center";

          .left-col {
            grid-area: left;
            align-items: flex-start;
          }

          .main-area {
            grid-area: center;
          }

          .right-col {
            grid-area: right;
            align-items: flex-end;
          }
        }

      }
    }
  }
`;

export default adsTesterPageStyles;