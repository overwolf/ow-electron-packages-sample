import React, { FC, useContext } from 'react';
import { RecordingActions } from '../../api-actions/recording-actions';
import { AppActions } from '../../api-actions/app-actions';
import AppContext from '../../context/app-context';
import { RecorderStats } from '@overwolf/ow-electron-packages-types';

const statusColors: Map<string, string> = new Map<string, string>([
  ['', 'red'],
  ['stopped', 'red'],
  ['recording', 'green'],
  ['replay', 'yellow'],
  ['replay-capture', 'lightGreen'],
]);

const formatElapsed = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s]
    .map((v) => String(v).padStart(2, '0'))
    .join(':');
};

// -----------------------------------------------------------------------------
const CaptureStatus: FC = () => {
  const { recordingStatus, recordingStats, outputPath, captureOutputStarted, captureElapsed } = useContext(AppContext)?.recording;

  const isCapturing = recordingStatus === 'recording';
  const isReplayCapturing = recordingStatus === 'replay-capture';

  return (
    <fieldset>
      <hr />
      <h4 className='settings-sub-title'>
        Status: 
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: statusColors.get(recordingStatus),
            position: 'relative',
            cursor: 'pointer',
            display: 'inline-block',
            marginLeft: '5px',
            marginRight: '5px',
          }}
          className="red-circle"
        ></div>
        
      </h4>
      {!recordingStats &&
        <h6>Empty stats</h6>
      }

      {recordingStats && recordingStats.activeFps && (
        <table>
          <tbody>
            <tr>
              <th>FPS:</th>
              <td>{recordingStats?.activeFps?.toFixed(2)}</td>
            </tr>
            <tr>
              <th>Remaining Disk space:</th>
              <td>{recordingStats?.availableDiskSpace?.toFixed(2)}</td>
            </tr>
            <tr>
              <th>CPU Usage:</th>
              <td>{recordingStats?.cpuUsage?.toFixed(2)}</td>
            </tr>
            <tr>
              <th>Ram Usage:</th>
              <td>{recordingStats?.memoryUsage?.toFixed(2)}</td>
            </tr>
            <tr>
              <th>skipped output frames:</th>
              <td>{recordingStats?.outputSkippedFrames} / {recordingStats?.outputTotalFrames}</td>
            </tr>
            <tr>
              <th>skipped render frames:</th>
              <td>{recordingStats?.renderSkippedFrames} / {recordingStats?.renderTotalFrames}</td>
            </tr>
          </tbody>
        </table>
      )}

      {isCapturing && (
        <p style={{ margin: '8px 0 4px', fontVariantNumeric: 'tabular-nums' }}>
          Capture duration: <strong>{formatElapsed(captureElapsed ?? 0)}</strong>
        </p>
      )}

      {isReplayCapturing && (
        <p style={{ margin: '8px 0 4px', fontVariantNumeric: 'tabular-nums' }}>
          Capture replay duration: <strong>{formatElapsed(captureElapsed ?? 0)}</strong>
        </p>
      )}

      {outputPath && (
        <button
          className="btn-secondary"
          onClick={() => AppActions.openFolder(outputPath)}
        >
          Open captures folder
        </button>
      )}
    </fieldset>
  );
};
export default CaptureStatus;
