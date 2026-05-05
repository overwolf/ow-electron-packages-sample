const sideBarStyles = `
  .side-bar {
    padding: 8px 0;
    background-color: var(--color-surface-tertiary);

    .electron-version {
      font-size: 14px;
      position: absolute;
      bottom: 4px;
      left: 10px;
    }

    .main-menu {

      ul {
        list-style: none;

        li {

          a {
            display: flex;
            align-items: center;
            gap: var(--space-200);
            padding: var(--space-200) var(--space-200) var(--space-200) var(--space-300);
            text-decoration: none;
            color: var(--color-text-primary);
            font-size: var(--font-size-350);
            font-weight: var(--font-weight-regular);
            line-height: var(--font-line-height-500);
            position: relative;

            svg {
              width: 24px;
              height: 24px;
              color: var(--color-icon-secondary);
            }

            &:hover {
              background-color: var(--color-surface-on-surface-primary-hover);

              svg {
                color: var(--color-icon-primary);
              }
            }
          }

          &.is-active a {
            background-color: var(--color-surface-brand-ow-focus);

            &::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 4px;
              height: 100%;
              background-color: var(--color-icon-brand-ow);
            }

            svg {
              color: var(--color-icon-primary);
            }
          }

        }
      }
    }

  }
`;

export default sideBarStyles;