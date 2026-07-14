import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import SectionHeader from '../layout/section-header';
import { PackageChannelsActions } from '../../api-actions/package-channels-actions';

type PackageState = {
  available: string[];
  current: string;
  version: string | null;
  pendingVersion: string | null;
  selected: string;
  error: string | null;
  isSetting: boolean;
  initFailedReason: string | null;
};

type PageState = {
  packages: Record<string, PackageState>;
  hasPendingUpdates: boolean;
  pendingUpdatePackages: { name: string; version: string }[];
  isLoading: boolean;
  logsFolderPath: string | null;
};

const PackageChannels: FC = () => {
  const [state, setState] = useState<PageState>({
    packages: {},
    hasPendingUpdates: false,
    pendingUpdatePackages: [],
    isLoading: true,
    logsFolderPath: null,
  });

  const listenersRegistered = useRef(false);

  const refresh = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const [available, current, versions, validPackages, logsFolderPath, initFailures] =
        await Promise.all([
          PackageChannelsActions.getAvailableChannels(),
          PackageChannelsActions.getCurrentChannels(),
          PackageChannelsActions.getPackageVersions(),
          PackageChannelsActions.getAvailablePackages(),
          PackageChannelsActions.getLogsFolderPath(),
          PackageChannelsActions.getInitFailures(),
        ]);

      const validSet = new Set(validPackages);
      const allNames = new Set(
        [...Object.keys(available), ...Object.keys(current)].filter(name => validSet.has(name)),
      );

      const packages: Record<string, PackageState> = {};
      allNames.forEach(name => {
        const currentChannel = current[name] ?? 'public';
        packages[name] = {
          available: available[name] ?? [],
          current: currentChannel,
          version: versions[name] ?? null,
          pendingVersion: null,
          selected: currentChannel,
          error: null,
          isSetting: false,
          initFailedReason: initFailures[name] ?? null,
        };
      });

      setState(prev => ({
        ...prev,
        packages,
        logsFolderPath,
        isLoading: false,
      }));
    } catch {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    refresh();

    if (!listenersRegistered.current) {
      listenersRegistered.current = true;

      PackageChannelsActions.onChannelReady(info => {
        setState(prev => {
          const pkg = prev.packages[info.name];
          if (!pkg) return prev;
          return {
            ...prev,
            hasPendingUpdates: true,
            packages: {
              ...prev.packages,
              [info.name]: {
                ...pkg,
                pendingVersion: info.version,
                isSetting: false,
              },
            },
          };
        });
      });

      PackageChannelsActions.onUpdatePending(packages => {
        setState(prev => ({
          ...prev,
          hasPendingUpdates: true,
          pendingUpdatePackages: packages ?? [],
        }));
      });

      PackageChannelsActions.onInitFailed(info => {
        setState(prev => {
          const pkg = prev.packages[info.name];
          if (!pkg) return prev;
          return {
            ...prev,
            packages: {
              ...prev.packages,
              [info.name]: { ...pkg, initFailedReason: info.reason },
            },
          };
        });
      });
    }
  }, [refresh]);

  const handleSelectChange = (pkgName: string, value: string) => {
    setState(prev => ({
      ...prev,
      packages: {
        ...prev.packages,
        [pkgName]: { ...prev.packages[pkgName], selected: value, error: null },
      },
    }));
  };

  const handleSetChannel = async (pkgName: string) => {
    const pkg = state.packages[pkgName];
    if (!pkg) return;

    const channel = pkg.selected === 'public' ? undefined : pkg.selected;

    setState(prev => ({
      ...prev,
      packages: {
        ...prev.packages,
        [pkgName]: {
          ...prev.packages[pkgName],
          isSetting: true,
          pendingVersion: 'downloading...',
          error: null,
        },
      },
    }));

    const result = await PackageChannelsActions.setChannel(pkgName, channel);

    if (!result.success) {
      setState(prev => ({
        ...prev,
        packages: {
          ...prev.packages,
          [pkgName]: {
            ...prev.packages[pkgName],
            isSetting: false,
            pendingVersion: null,
            error: result.error ?? 'Failed to set channel',
          },
        },
      }));
    } else {
      setState(prev => ({
        ...prev,
        packages: {
          ...prev.packages,
          [pkgName]: {
            ...prev.packages[pkgName],
            current: pkg.selected,
            isSetting: false,
          },
        },
      }));

      // onChannelReady fires once a download completes. If the package was
      // already at the requested channel's version, no download happens and
      // it never fires — so fall back to "Up to date" if it stays quiet.
      setTimeout(() => {
        setState(prev => {
          const current = prev.packages[pkgName];
          if (!current || current.pendingVersion !== 'downloading...') return prev;
          return {
            ...prev,
            packages: {
              ...prev.packages,
              [pkgName]: { ...current, pendingVersion: 'up-to-date' },
            },
          };
        });
      }, 5000);
    }
  };

  const handleRelaunch = () => {
    PackageChannelsActions.relaunch();
  };

  const handleOpenLogsFolder = () => {
    if (state.logsFolderPath) {
      PackageChannelsActions.openFolder(state.logsFolderPath);
    }
  };

  return (
    <section className='channels-section'>
      <SectionHeader
        title='Package Channels'
        description='Switch packages between public and dev release channels'
      />

      {state.hasPendingUpdates && (
        <div className='restart-banner'>
          <span>
            {state.pendingUpdatePackages.length > 0
              ? `Updates available: ${state.pendingUpdatePackages
                  .map(p => `${p.name}@${p.version}`)
                  .join(', ')} - restart to apply`
              : 'Updates downloaded - restart to apply'}
          </span>
          <button className='btn-primary' onClick={handleRelaunch}>
            Restart App
          </button>
        </div>
      )}

      <div className='channels-toolbar'>
        <button
          className='btn-secondary'
          onClick={refresh}
          disabled={state.isLoading}
        >
          {state.isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {state.logsFolderPath && (
        <div className='logs-folder-row'>
          <span className='logs-folder-label'>Package logs:</span>
          <span className='logs-folder-path' title={state.logsFolderPath}>
            {state.logsFolderPath}
          </span>
          <button className='btn-secondary' onClick={handleOpenLogsFolder}>
            Open Logs Folder
          </button>
        </div>
      )}

      <ul className='channel-pkg-list'>
        {Object.entries(state.packages).map(([pkgName, pkg]) => (
          <li key={pkgName} className='channel-pkg-row'>
            <span className='channel-pkg-name'>{pkgName}</span>

            {pkg.version && (
              <span className='channel-pkg-version'>v{pkg.version}</span>
            )}

            {!pkg.version && pkg.initFailedReason && (
              <span className='channel-init-failed' title={`reason: ${pkg.initFailedReason}`}>
                init failed
              </span>
            )}

            <span className={`channel-badge${pkg.current === 'public' ? ' is-public' : ''}`}>
              {pkg.current}
            </span>

            <div className='channel-select-wrap'>
              {pkg.available.length === 0 ? (
                <span className='channel-no-channels'>public (default)</span>
              ) : (
                <>
                  <select
                    value={pkg.selected}
                    onChange={e => handleSelectChange(pkgName, e.target.value)}
                    disabled={pkg.isSetting}
                  >
                    <option value='public'>public (default)</option>
                    {pkg.available.map(ch => (
                      <option key={ch} value={ch}>
                        {ch}
                      </option>
                    ))}
                  </select>

                  <button
                    className='btn-primary'
                    onClick={() => handleSetChannel(pkgName)}
                    disabled={pkg.isSetting || pkg.selected === pkg.current}
                  >
                    Set Channel
                  </button>
                </>
              )}
            </div>

            {pkg.pendingVersion && (
              <span className='channel-pending'>
                {pkg.pendingVersion === 'downloading...'
                  ? 'downloading...'
                  : pkg.pendingVersion === 'up-to-date'
                    ? 'Up to date'
                    : `pending: v${pkg.pendingVersion}`}
              </span>
            )}

            {pkg.error && (
              <span className='channel-error'>{pkg.error}</span>
            )}
          </li>
        ))}

        {!state.isLoading && Object.keys(state.packages).length === 0 && (
          <li className='channel-pkg-row'>
            <span className='channel-pending'>No packages found</span>
          </li>
        )}
      </ul>
    </section>
  );
};

export default PackageChannels;
