const loggerPageStyles = `
  .logger-section {
    display: flex;
    flex-direction: column;
    flex: 1;

    .page-inner {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .log-terminal {
      border: none;
      padding: var(--space-400);
      width: 100%;
      resize: none;
      flex: 1;
      font-family: Consolas, monospace;
      font-size: var(--font-size-350);
      font-weight: var(--font-weight-regular);
      line-height: var(--space-500);
    }

    .page-actions {
      padding: var(--space-300);
      background-color: var(--color-surface-secondary);
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

  }
`;

export default loggerPageStyles;