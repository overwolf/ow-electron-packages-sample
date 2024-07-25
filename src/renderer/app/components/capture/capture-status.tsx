import React, { FC, useContext } from 'react';
import { RecordingActions } from '../../api-actions/recording-actions';
import AppContext from '../../context/app-context';
import { RecorderStats } from '@overwolf/ow-electron-packages-types';

const statusColors: Map<string, string> = new Map<string, string>([
  ['', 'red'],
  ['stopped', 'red'],
  ['recording', 'green'],
  ['replay', 'yellow'],
  ['replay-capture', 'lightGreen'],
]);
// -----------------------------------------------------------------------------
const CaptureStatus: FC = () => {
  const { recordingStatus, recordingStats } = useContext(AppContext)?.recording;
  return (
    <fieldset>
      <legend>
        {' '}
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
        status:
      </legend>
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
    </fieldset>
  );
};
export default CaptureStatus;
