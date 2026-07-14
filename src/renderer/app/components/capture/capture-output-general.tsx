import React, { FC, useState, useContext, useEffect } from 'react';
import AppContext from '../../context/app-context';
import { RecordingActions } from '../../api-actions/recording-actions';
import { AppActions } from '../../api-actions/app-actions';
import AnyTypeInput from '../app-settings/input-elements/any-type-input';

const CaptureOutputGeneral: FC = () => {
  const {
    recordingInfo,
    recordingOptions,
    outputPath,
    selectedDisplay,
    setSelectedDisplay,
    setRecordingOptions,
    setOutputPath,
  } = useContext(AppContext)?.recording;

  const handleOutputPathChange = (path?: string | null) => {
    if (!path) {
      return;
    }

    setOutputPath(path);
    setRecordingOptions({
      ...recordingOptions,
      filePath: path,
    });
  };

  //----------------------------------------------------------------------------
  const handleDisplayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const displayId = e.target.value;
    setSelectedDisplay(displayId);
  };
  //----------------------------------------------------------------------------

  useEffect(() => {}, [outputPath]);

  return (
    <div className="recording-output">
      <div className="output-row">
        <div className="output-directory">
          <AnyTypeInput
            labelText="Output Path"
            id="outputPath"
            type="text"
            value={outputPath ? outputPath : 'Path not set yet'}
            readOnly
          />

          <button
            onClick={async () => {
              const path = await AppActions.openFolderPicker();
              handleOutputPathChange(path);
            }}
            className="btn-secondary"
          >
            Select directory
          </button>

          {outputPath && (
            <button
              onClick={async () => {
                await AppActions.openFolder(outputPath);
              }}
              className="btn-secondary"
            >
              Open
            </button>
          )}
        </div>
      </div>

      <div className="output-row">
        <div className="settings-input-item displays">
          <label htmlFor="displays">Display</label>
          <select
            id="displays"
            value={selectedDisplay || ''}
            onChange={(e) => {
              handleDisplayChange(e);
            }}
          >
            <option value="">-- No Display (QA test) --</option>
            {recordingInfo &&
              recordingInfo?.monitors?.map((monitor) => {
                return (
                  <option key={monitor.id} value={monitor.altId}>
                    {`${monitor.altId}_${monitor.friendlyName}`}
                  </option>
                );
              })}
          </select>
        </div>
      </div>
    </div>
  );
};
export default CaptureOutputGeneral;
