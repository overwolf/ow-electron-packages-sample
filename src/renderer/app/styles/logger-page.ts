const loggerPageStyles = `
  .logger-section {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;

    .page-inner {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }

    .log-toolbar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: var(--space-200) var(--space-400);
      background-color: var(--color-surface-secondary);
      border-bottom: 1px solid var(--color-border-primary);
    }

    .log-search {
      flex: 1;
      background: var(--color-surface-primary);
      border: 1px solid var(--color-border-primary);
      border-radius: 4px;
      padding: 4px 8px;
      font-family: Consolas, monospace;
      font-size: var(--font-size-350);
      color: var(--color-text-primary);
      outline: none;

      &:focus {
        border-color: var(--color-brand-primary, #64b5f6);
      }

      &::placeholder {
        color: var(--color-text-tertiary);
      }
    }

    .log-search-count {
      font-size: var(--font-size-350);
      color: var(--color-text-tertiary);
      white-space: nowrap;
    }

    .log-terminal {
      padding: var(--space-400);
      width: 100%;
      flex: 1;
      min-height: 0;
      font-family: Consolas, monospace;
      font-size: var(--font-size-350);
      font-weight: var(--font-weight-regular);
      line-height: var(--space-500);
      overflow-y: auto;
    }

    .log-entry {
      padding: 3px 0;
      border-bottom: 1px solid #252525;
      white-space: pre-wrap;
      word-break: break-all;
    }

    .log-entry-arg {
      margin: 2px 0 0 12px;
      padding: 2px 6px;
      border-left: 2px solid #333;
      font-family: Consolas, monospace;
      font-size: var(--font-size-350);
    }

    /* ── JsonNode tree ── */
    .jv-node   { display: inline; }
    .jv-block  { padding-left: 16px; display: block; }
    .jv-row    { display: block; }

    .jv-toggle {
      background: none;
      border: none;
      padding: 0 2px;
      cursor: pointer;
      font-size: 10px;
      color: #888;
      line-height: 1;
      vertical-align: middle;
      &:hover { color: #ccc; }
    }

    .jv-brace         { color: #ccc; }
    .jv-preview-entry { display: inline; }
    .jv-preview-more  { color: #888; }
    .jv-key     { color: #9cdcfe; }
    .jv-colon   { color: #ccc; }
    .jv-comma   { color: #ccc; }
    .jv-string  { color: #ce9178; }
    .jv-number  { color: #b5cea8; }
    .jv-boolean { color: #569cd6; }
    .jv-null    { color: #808080; }

    .log-entry.info    { color: #ccc; }
    .log-entry.warn    { color: #ffa726; }
    .log-entry.success { color: #66bb6a; }
    .log-entry.error   { color: #ef5350; }
    .log-entry.result  { color: #64b5f6; padding-left: 16px; }
    .log-entry.dim     { color: #555; }

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
