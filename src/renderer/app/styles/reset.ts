const resetStyles = `
  *,
  *:before,
  *:after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    border: none;
  }

  html {
    height: 100%;
  }

  strong, b {
    font-weight: 700
  }

  em, i {
    font-style: italic
  }

  body {
    font-family: var(--font-family-default);
    color: var(--color-text-secondary);
    font-size: var(--font-size-400);
    font-weight: var(--font-weight-regular);
    line-height: var(--font-line-height-600);
    background-color: var(--color-background-general);
    padding: 0;
    margin: 0;
    height: 100%;
  }


  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
    background-color: var(--color-surface-primary);
  }

  ::-webkit-scrollbar-thumb {
    border-width: 0;
    background: var(--color-surface-quaternary);
    background-clip: padding-box;
  }

  a, button {
    font-family: var(--font-family-default);
    transition: all 150ms ease;
    color: var(--color-text-pure);
    text-decoration-line: underline;
    text-underline-offset: 3px;
    background: transparent;

    &:hover {
      color: var(--color-text-brand-ow-hover);
      text-decoration: none !important;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-family-default);
    color: var(--color-text-primary);
    font-weight: var(--font-weight-bold);
  }

  hr {
    margin: 16px 0;
    border: 0;
    border-top: 1px solid var(--color-border-on-surface);
  }

  p {
    font-family: var(--font-family-default);
    color: var(--color-text-secondary);
    font-size: var(--font-size-400);
    font-weight: var(--font-weight-regular);
    line-height: var(--font-line-height-600);
  }

  .is-disabled {
    pointer-events: none;
    opacity: 0.4;
  }

  .btn-primary,
  .btn-secondary {
    padding: 0 var(--space-400);
    border: 1px solid var(--color-border-secondary);
    text-decoration: none;
    color: var(--color-text-primary);
    font-size: var(--font-size-350);
    font-weight: var(--font-weight-bold);
    line-height: var(--font-line-height-500);
    height: 32px;
    text-align: center;
    white-space: nowrap;
    cursor: pointer;
    display: inline-block;
    background-color: transparent;
    background-image: unset;
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    outline: none;

    &:hover {
      color: var(--color-text-primary);
      background-color: var(--color-surface-on-surface-secondary-hover);
      border-color: var(--color-surface-on-surface-secondary-hover);
      text-decoration: none;
    }

    &.disabled,
    &[disabled] {
      pointer-events: none;
      background-color: unset;
      opacity: 0.3;
    }

    &.icon-big {
      border: none;
      padding: 0;
      color: var(--color-icon-secondary);

      svg {
        width: 32px;
        height: 32px;
        pointer-events: none;
      }

    }

    &.icon-small {
      display: flex;
      align-items: center;
      gap: var(--space-200);

      svg {
        width: 24px;
        height: 24px;
        pointer-events: none;
      }

    }
  }

  .btn-primary {
    background-color: var(--color-surface-brand-ow);
    color: var(--color-text-cta-ow);
    border: none;

    &.disabled, &.btn[disabled] {
      background-color: var(--color-surface-brand-ow);
    }

    &:hover {
      color: var(--color-text-cta-ow);
      background-color: var(--color-surface-brand-ow-hover);
      text-decoration: none;
    }
  }

  .btn-secondary {

    &:hover {
      background-color: var(--color-surface-on-surface-primary-hover);
      text-decoration: none;
    }
  }

  textarea, input[type="text"], input[type="password"], input[type="datetime"], input[type="datetime-local"], input[type="date"], input[type="month"], input[type="time"], input[type="week"], input[type="number"], input[type="email"], input[type="url"], input[type="search"], input[type="tel"] {
    border: 1px solid var(--color-border-on-surface);
    background-color: var(--color-surface-on-surface-primary);
    border-radius: 0;
    height: 32px;
    font-family: var(--font-family-default);
    color: var(--color-text-primary); 
    font-size: var(--font-size-400);
    font-weight: var(--font-weight-regular);
    line-height: 31px;
    caret-color: var(--color-text-brand-ow);
    padding: 1px 8px 2px;
    box-shadow: none;
    transition: border 300ms ease;
    margin: 0;
    outline: none;
    box-sizing: border-box;

    &::placeholder {
      color: var(--color-text-tertiary);
    }

    &:-webkit-autofill {
      -webkit-box-shadow: none !important; /* Change 'white' to match your background */
      -webkit-text-fill-color: var(--color-text-primary) !important; /* Set text color */
      transition: background-color 5000s ease-in-out 0s;
    }

    &:hover, &:focus {
      border-color: var(--color-border-primary);
    }
  }

  input[type="color"] {
    padding: 0;
    border: 1px solid var(--color-border-on-surface);
    background: transparent;
    cursor: pointer;
    appearance: none;
    width: 80px;
	  height: 32px;
    transition: border 300ms ease;

    &::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    &::-webkit-color-swatch {
      border: none;
    }

    &:hover, &:focus {
      border-color: var(--color-border-primary);
    }
  }

  input[type=checkbox] {
    appearance: none;
    width: 20px;
    height: 20px;
    background-color: transparent;
    border: 2px solid var(--color-border-secondary);
    outline: none;
    margin: 0;
    border-radius: 0;

    &:hover, &:focus {
      border-color: var(--color-border-primary);
      background-color: var(--color-surface-on-surface-primary-hover);
      outline: none;
    }

    &:checked {
      border-color: var(--color-icon-brand-ow);
      background-color: var(--color-icon-brand-ow);
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 20px;
      background-image: var(--icon-checkbox-checked);
      outline: none;

      &:hover {
        border-color: var(--color-surface-brand-ow-hover);
        background-color: var(--color-surface-brand-ow-hover);
        outline: none;
      }

    }
  }

  input[type="file"]::-webkit-file-upload-button {
    /* chromes and blink button */
    cursor: pointer;
  }

  select {
    width: 320px;
    max-width: 100%;
    height: 32px;
    margin: 0;
    background-color: var(--color-surface-on-surface-secondary);
    color: var(--color-text-primary);
    font-size: var(--font-size-350);
    font-style: normal;
    font-weight: var(--font-weight-regular);
    line-height: var(--font-line-height-500);
    appearance: base-select;
    border-radius: 0;
    border: none;
    padding: 4px 12px 4px 6px;
    outline: none !important;
    border: 1px solid transparent;
    transition: border 300ms ease;
    position: relative;

    &:hover {
      background-color: var(--color-surface-on-surface-secondary-hover);
    }

    // &:focus {
    //   border-color: 1px solid var(--color-border-primary);
    // }

    @media (max-width: 600px) {
      appearance: none;
      background-image: var(--picker-icon);
      background-size: 24px;
      background-repeat: no-repeat;
      background-position: right 6px top 8px;
    }

    &::picker-icon {
      display: none;
    }

    &::before {
      content: '';
      background-image: var(--picker-icon);
      width: 24px;
      height: 24px;
      position: absolute;
      right: 6px;
      z-index: 1;
    }

    &::picker(select) {
      appearance: base-select;
      border: 1px solid var(--color-border-tertiary);
      background-color: var(--color-surface-tertiary);
      max-height: 240px;
      margin-top: 2px;

        // scrollbar
        &::-webkit-scrollbar {
          width: 4px;
          height: 4px;
          background-color: var(--color-surface-primary);
        }
    
        &::-webkit-scrollbar-thumb {
          border-width: 0;
          background: var(--color-surface-quaternary);
          background-clip: padding-box;
        }
    }

    & option {
      padding: 8px 12px;
      height: 40px;
      color: var(--color-text-primary);
      font-family: var(--font-family-default);
      font-size: var(--font-size-400);
      font-weight: var(--font-weight-regular);
      line-height: var(--font-line-height-600);
      background-color: var(--color-surface-tertiary);
      cursor: pointer;

      &:hover {
        background-color: var(--color-surface-on-surface-primary-hover);
      }

      &::checkmark {
        order: 1;
        margin-left: auto;
        width: 20px;
        height: 20px;
        content: '';
        background-image: var(--icon-dropdown-checkmark);
        background-size: 20px;
        background-position: center center;
        background-repeat: no-repeat;
      }

      &:checked {
        font-weight: var(--font-weight-bold);
        background-color: var(--color-surface-tertiary);
      }
    }
  }

  textarea {
    min-height: 144px;
    padding: var(--space-300) var(--space-400);
  }

  label {
    color: var(--color-text-secondary);
    font-size: var(--font-size-350);
    line-height: var(--font-line-height-500);
  }

  .notice-alert {
    display: flex;
    align-items: center;
    padding: var(--space-100) var(--space-300) var(--space-100) var(--space-200);
    gap: var(--space-100);
    font-size: var(--font-size-350);
    font-weight: var(--font-weight-regular);
    line-height: var(--font-line-height-500);

    svg {
      width: 20px;
      height: 20px;
    }

    &.info {
      color: var(--color-text-info);
      border: 1px solid var(--color-border-info);
      background: var(--color-surface-info-transparent);
    }
  }

   input[type=range] {
    appearance: none;
    width: 100%;
    height: 4px;
    padding: 0;
    margin: 0;
    color: var(--color-surface-on-surface-secondary);
    background: transparent;

    &::-webkit-slider-runnable-track {
      width: 100%;
      cursor: pointer;
			height: 4px;
      background: linear-gradient(to right, var(--color-icon-brand-ow) calc(var(--value)* 1%), var(--color-surface-on-surface-secondary) 0);
    }

    &::-webkit-slider-thumb {
      height: 12px;
      width: 12px;
      position: relative;
      z-index: 1;
      border-radius: 50%;
      background-color: var(--color-icon-brand-ow);
      appearance: none;
      transition: all 150ms ease-in-out;
      margin-top: -4px;
    }

    &:hover::-webkit-slider-thumb {
      background-color: var(--color-brand-ow-hover);
      box-shadow: 0px 0px 0px 2px var(--color-brand-ow-hover);
    }
  }

  .radio-option {
    height: 20px;
    display: flex;

    label {
      display: flex;
      align-items: center;
      flex: 1;

      p span {
        color: var(--color-text-secondary);
        font-size: var(--font-size-350);
        font-weight: var(--font-weight-regular);
        line-height: var(--font-line-height-500);
      }
    }

    b {
      order: -1;
      flex-shrink: 0;
      display: flex;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      margin-right: 8px;
      position: relative;
      background-color: transparent;
      border: 2px solid var(--color-border-secondary);
      transition: border 0.15s;

      &:before {
        content: "";
        position: absolute;
        opacity: 0;
        transition: .15s;
      }
    }

    input[type="radio"] + label b:before {
      top: -1px;
      bottom: -1px;
      left: -1px;
      right: -1px;
      transform: scale(0);
      transition: 300ms cubic-bezier(0.680, -0.8, 0.265, 1.8);
      background: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27100%25%27%20height%3D%27100%25%27%20viewBox%3D%270%200%2024%2024%27%3E%5Ca%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ccircle%20cx%3D%2712%27%20cy%3D%2712%27%20r%3D%275%27%20fill%3D%27%23F4F2FF%27%2F%3E%5Ca%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fsvg%3E");
    }

    &:hover {
      b {
        border-color: var(--color-border-primary);
        background-color: var(--color-surface-on-surface-primary-hover);
      }
    }

    input[type="radio"]:checked + label {

      b {
        background-color: var(--color-surface-brand-ow);
        border-color: var(--color-surface-brand-ow);

        &:before {
          transform: scale(1.3);
          opacity: 1;
        }
      }
    }
  }

.toggle-input, .on-off-toggle-input {
  min-height: 20px;
  display: flex;
  width: 100%;

  label {
    display: flex;
    align-items: center;
    flex: 1;

    > * + * {
      margin-left: 16px;
    }
  }

  span {
    flex-grow: 1;
    color: var(--color-text-secondary);
    font-size: var(--font-size-350);
    line-height: var(--font-line-height-500);
  }

  b {
    flex-shrink: 0;
    display: flex;
    width: 32px;
    height: 20px;
    border-radius: 12.5px;
    position: relative;
    background-color: var(--color-surface-on-surface-secondary);
    transition: background-color 0.15s;
    cursor: pointer;

    &:before {
      content: "";
      position: absolute;
      transition: .15s;
    }
  }

  input[type="checkbox"] + label b:before {
    top: 0;
    bottom: 0;
    left: 0;
    margin: 4px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: var(--color-icon-secondary);
    transition: 300ms;
  }

  input[type="checkbox"]:checked + label {
    b {
      background-color: var(--color-brand-ow);
      &:before {
        transform: translateX(12px);
        background-color: var(--color-surface-invert);
      }
    }
  }

  &:hover {
    b {
      background-color: var(--color-surface-on-surface-secondary-hover);
    }

    input[type="checkbox"]:checked + label {
      b {
        background-color: var(--color-brand-ow-hover);
      }
    }
  }
}

.on-off-toggle-input {
  width: auto;

   label {
   
    > * + * {
      margin-left: 8px;
    }
  }
}

`;

export default resetStyles;
