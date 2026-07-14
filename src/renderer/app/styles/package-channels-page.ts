const packageChannelsPageStyles = `
  .channels-section {

    .channels-toolbar {
      display: flex;
      align-items: center;
      gap: var(--space-300);
      margin-bottom: var(--space-400);
    }

    .logs-folder-row {
      display: flex;
      align-items: center;
      gap: var(--space-300);
      padding: var(--space-300) var(--space-400);
      margin-bottom: var(--space-400);
      background-color: var(--color-surface-tertiary);

      .logs-folder-label {
        font-size: var(--font-size-350);
        font-weight: var(--font-weight-semi-bold);
        white-space: nowrap;
      }

      .logs-folder-path {
        flex: 1;
        min-width: 0;
        font-size: var(--font-size-300);
        color: var(--color-text-tertiary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .channel-pkg-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow-y: auto;
      height: calc(100vh - 220px);
    }

    .channel-pkg-row {
      background-color: var(--color-surface-tertiary);
      padding: var(--space-300) var(--space-400);
      display: flex;
      align-items: center;
      gap: var(--space-400);
      flex-wrap: wrap;

      .channel-pkg-name {
        font-size: var(--font-size-450);
        font-weight: var(--font-weight-semi-bold);
        min-width: 80px;
      }

      .channel-pkg-version {
        font-size: var(--font-size-300);
        color: var(--color-text-tertiary);
        white-space: nowrap;
        width: 80px;
        min-width: 80px;
      }

      .channel-badge {
        font-size: var(--font-size-300);
        font-weight: var(--font-weight-semi-bold);
        padding: 2px 0;
        border-radius: 4px;
        background-color: var(--color-surface-secondary);
        color: var(--color-text-secondary);
        border: 1px solid var(--color-border-on-surface);
        white-space: nowrap;
        width: 80px;
        min-width: 80px;
        text-align: center;

        &.is-public {
          border-color: var(--color-icon-brand-ow);
          color: var(--color-icon-brand-ow);
        }
      }

      .channel-select-wrap {
        display: flex;
        align-items: center;
        gap: var(--space-200);
        flex: 1;
        min-width: 200px;

        select {
          flex: 1;
          max-width: 240px;
        }
      }

      .channel-no-channels {
        font-size: var(--font-size-350);
        color: var(--color-text-secondary);
      }

      .channel-pending {
        font-size: var(--font-size-300);
        color: var(--color-text-tertiary);
        white-space: nowrap;
      }

      .channel-error {
        font-size: var(--font-size-300);
        color: #ff8d8d;
      }

      .channel-init-failed {
        font-size: var(--font-size-300);
        font-weight: var(--font-weight-semi-bold);
        color: #ff8d8d;
        white-space: nowrap;
        width: 80px;
        min-width: 80px;
      }
    }

    .restart-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-400);
      padding: var(--space-300) var(--space-400);
      background-color: var(--color-surface-brand-ow-focus);
      margin-bottom: var(--space-300);

      span {
        font-size: var(--font-size-350);
      }
    }
  }
`;

export default packageChannelsPageStyles;
