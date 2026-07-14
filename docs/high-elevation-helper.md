# High Elevation Helper

## What it is

The High Elevation Helper is a small native component installed to  
`%CommonProgramFiles%\<app-name>\`.  
It allows the Overwolf overlay to inject into games that run as **Administrator**  
(elevated processes). Without it, injection into elevated games is blocked by Windows.

Installation requires a **one-time UAC prompt**. Once the user approves it,
`isHighElevationHelperInstalled()` returns `true` permanently — no re-installation
needed on subsequent launches. As long as it returns `true`, injection into elevated
processes will work.

> **Note:** If both the game *and* your app are already elevated, `processInfo.isElevated`
> returns `false` and normal injection works — the helper is only needed when the *game*
> is elevated but your app is not.

---

## API

Both `IOverwolfUtilityApi` and `IOverwolfOverlayApi` expose the same two methods:

```ts
isHighElevationHelperInstalled(): Promise<boolean>
installHighElevationHelper(): Promise<void>
```

`installHighElevationHelper` triggers a UAC prompt — it must be initiated by an
explicit user action, not called silently in the background.

---

## When to call `installHighElevationHelper`

The install does **not** have to happen at game launch. You can (and should) prompt
the user earlier — for example on first app launch, in an onboarding flow, or from a
settings screen — so it is ready before any elevated game starts.

```ts
// Any time the user explicitly requests it, e.g. a settings button click:
async function onInstallHelperClicked() {
  const alreadyInstalled = await overlayApi.isHighElevationHelperInstalled?.();
  if (alreadyInstalled) {
    console.log('High Elevation Helper already installed');
    return;
  }

  console.log('Installing High Elevation Helper...');
  await overlayApi.installHighElevationHelper?.();
  console.log('High Elevation Helper installed');
}
```

---

## When to check

### On package ready

Check once at startup to log the current state.

```ts
this._utilityApi.isHighElevationHelperInstalled?.().then((installed) => {
  console.log('isHighElevationHelperInstalled:', installed);
});
```

### On game-launched

Check right before deciding whether to call `event.inject()`.

```ts
async function onGameLaunched(event: GameLaunchEvent, gameInfo: GameInfo) {
  // Non-elevated games: inject immediately
  if (gameInfo.processInfo?.isElevated !== true) {
    return event.inject();
  }

  // Elevated game — helper required
  const installed = await overlayApi.isHighElevationHelperInstalled?.();
  if (installed) {
    console.log(`Elevated game "${gameInfo.name}" - helper installed, injecting`);
    event.inject();
    return;
  }

  // Helper missing — prompt the user, then inject if they install it
  console.warn(`Elevated game "${gameInfo.name}" - helper not installed, prompting user`);
  const userConfirmed = await promptUser(); // show your UI here
  if (userConfirmed) {
    await overlayApi.installHighElevationHelper?.();
    event.inject();
  }
}
```

---

## Decision flow

```
app launch
    │
    ▼
isHighElevationHelperInstalled?
    │
    No ──► show install prompt (onboarding / settings)
    │           └─ user approves UAC ──► installed permanently
    Yes
    │
    ▼
  (ready for elevated games)


game-launched
      │
      ▼
isElevated? ──No──► inject()
      │
     Yes
      │
      ▼
isHighElevationHelperInstalled?
      │
     Yes──► inject()
      │
      No
      │
      ▼
prompt user
      ├─ Install ──► installHighElevationHelper() ──► inject()
      └─ Cancel  ──► skip injection
```
