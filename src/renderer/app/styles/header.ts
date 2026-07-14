const headerStyles = `
  .header {
    background: var(--color-surface-secondary);
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 32px;
    padding-left: 4px;

    h1 {
      display: flex;
      gap: 4px;
      align-items: center;

      .logo {
        width: 95px;
        height: 24px;
      }

      .app-name {
        width: 175px;
        height: 20px;
      }
    }

    .window-actions {
      display: flex;

      button, svg {
        width: 32px;
        height: 32px;
      }

     .icon-btn {
        color: var(--color-icon-secondary);

        svg {
          pointer-events: none;
        }

        &:hover {
          color: var(--color-icon-primary);
          background-color: var(--color-surface-on-surface-primary-hover);
        }

        &.close-btn:hover {
          background-color: var(--color-surface-brand-ow-hover);
          color: var(--color-icon-cta-ow);
        }
      }
    }

  }

  .top-buttons-panel {
    padding: 12px;
    background: var(--color-surface-secondary);
    border-bottom: 1px solid var(--color-border-on-surface);

    .top-buttons-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 2px;
    }

    .top-buttons-table .btn-secondary {
      width: 180px;
      justify-content: center;
    }

    .top-buttons-track-group {
      display: flex;
      gap: 4px;
      align-items: center;
      flex-wrap: wrap;
    }

    input[type='number'] {
      width: 120px;
    }
  }
`;

export default headerStyles;
