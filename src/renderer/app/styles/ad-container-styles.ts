const AdContainerStyles = `
 .ad-wrapper {
    position: relative;

    .ad-container {
      outline: 1px solid var(--color-border-on-surface);
      background: transparent;
    }

    &.high-impact-active {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .ad-container {
        width: 100% !important;
        height: 100% !important;
      }

      .ad-actions {
        z-index: 100;
      }
    }

    .ad-actions {
      position: absolute;
      bottom: -21px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      span {
        font-size: 12px;
      }

      .ad-btn {
        text-decoration: none;
        font-size: 12px;
      }
    }
  }
`;

export default AdContainerStyles;