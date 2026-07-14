# ow-electron-packages-sample

A basic sample app, demonstrating how [@overwolf/ow-electron](https://npmjs.com/package/@overwolf/ow-electron) packages (Overlay, Game Events) work.

For more details about ow-electron, as well as how to fully utilize it, please refer to the official [documentation](https://overwolf.github.io/tools/ow-electron).

## Setup

To set up this app, you must first install its dependencies (using [yarn](https://yarnpkg.com/), [npm](https://www.npmjs.com/), or any other package manager).

From there, you can easily run/interact with it.

## Quick start 

To run the app in development mode, simply run the `build` script, followed by the `start` script from the package.json.  
For example:

```shell
# Using npm
npm run build
npm run start

# Using yarn
yarn build
yarn start
```

### VSCode launch.json

This repository also includes a working `.vscode/launch.json` file, meaning that you can launch the app by simply clicking `F5` on your keyboard (for default vscode settings).

## Quick Build

To build the app for production, you must run the `build` script, followed by the `build:ow-electron` script from the package.json.  
For example:

```shell
# Using npm
npm run build
npm run build:ow-electron

# Using yarn
yarn build
yarn build:ow-electron
```

## Dev Mode

*Available since `ow-electron@39.8.10` (Windows only).*

Dev Mode lets you run and test the gaming packages (GEP, Overlay, Recorder) locally, without having to sign your app first. Without valid credentials, the app still runs, but the gaming packages stay inactive and production validation kicks in instead.

To enable it, provide credentials using one of the following methods:

```shell
# Option A: environment variables (recommended for CI)
# Windows (PowerShell)
$env:OW_CLI_EMAIL = "your-email@example.com"
$env:OW_CLI_API_KEY = "your-api-key-from-console"
# Or dev token
$env:OW_DEV_KEY=your-dev-token

# Linux / macOS
export OW_CLI_EMAIL=your-email@example.com
export OW_CLI_API_KEY=your-api-key-from-console
# Or dev token
export OW_DEV_KEY=your-dev-token
```

Option C: set them in [.vscode/launch.json](.vscode/launch.json), under the `env` section of the `OW-Electron: Main Process` configuration:

```jsonc
"env": {
  "OW_CLI_EMAIL": "your-email@example.com",
  "OW_CLI_API_KEY": "your-api-key-from-console"
  // or, instead of the two above:
  // "OW_DEV_KEY": "your-dev-token"
}
```

For full details, see the [Dev Mode guide](https://dev.overwolf.com/ow-electron/guides/dev-tools/dev-mode).

## App Signing

Before releasing your app, both Overwolf and you need to sign it: Overwolf signs the gaming package integrity, and you sign the exe with your own code-signing certificate. Without both signatures, the gaming packages will not load at runtime.

To sign your app:

1. Set the following environment variables:
   ```shell
   OW_CLI_EMAIL=your-email@example.com      # Your Overwolf Console account email
   OW_CLI_API_KEY=your-api-key-from-console # Console > Profile > API Keys
   OW_BUILD_KEY=your-build-key              # Console > Release management > App Keys
   ```
2. Run the builder:
   ```shell
   npx @overwolf/ow-electron-builder
   ```

This also requires a registered app (with a UID) in the Overwolf Console, and your own code-signing certificate for the executable.

For full details, see the [App Signing guide](https://dev.overwolf.com/ow-electron/guides/dev-tools/app-signing).

> **Note:** If you plan to host your app on the Overwolf app store, a Digital Code Signature is **mandatory** as part of the [pre-submission checklist](https://dev.overwolf.com/ow-electron/getting-started/release-your-app#pre-submission-checklist). It's strongly recommended to obtain a digital certificate to avoid Windows installation warnings for your users.

## Working with ow-electron packages

In order to add more/remove certain ow-electron "packages" from the project, simply edit the `overwolf.packages` array in the [package.json](/package.json) file, like so:

```json
{
  ...
  "overwolf": {
    "packages": [
      "gep",
      "overlay",
      "recorder"
    ]
  },
  ...
}
```

### Available packages detailed information
* [Recorder](./docs/recorder/recorder.md)
* [Game Events Provider](./docs/gep/game-events-provider.md)
* [Overlay](./docs//overlay/overlay.md)
