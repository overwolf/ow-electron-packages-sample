const overlayWindowHeaderStyles = `
  .overlay-window-header {
    background: var(--color-surface-secondary);
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 32px;
    padding-left: 4px;
    user-select: none;
    -webkit-app-region: drag;

    .logo-symbol {
      svg {
        width: 24px;
        height: 24px;
        color: var(--color-icon-primary);
        pointer-events: none;
      }
    }

    h1 {
      color: var(--color-text-tertiary);
      text-align: center;
      font-size: var(--font-size-350);
      font-weight: var(--font-weight-regular);
      line-height: var(--font-line-height-500);
      margin: 0;

      span {
        color: var(--color-text-primary);
      }
    }

    .overlay-window-actions {
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
`;

export default overlayWindowHeaderStyles;