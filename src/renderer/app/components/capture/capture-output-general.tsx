import React, { FC, useState, useContext, useEffect } from 'react';
import AppContext from '../../context/app-context';
import { RecordingActions } from '../../api-actions/recording-actions';
import { AppActions } from '../../api-actions/app-actions';

const CaptureOutputGeneral: FC = () => {
  const {
    recordingInfo,
    recordingOptions,
    setRecordingOptions,
    selectedDisplays,
    setSelectedDisplays,
  } = useContext(AppContext)?.recording;

  const [outputPath, setOutputPath] = useState<string>('');

  useEffect(() => {}, [outputPath]);

  return (
    <fieldset>
      <legend>General:</legend>
      {outputPath && (
        <button
          onClick={async () => {
            await AppActions.openFolder(outputPath);
          }}
        >
          {' '}
          Open Output Directory
        </button>
      )}
      <h5>{outputPath}</h5>

      <button
        onClick={async () => {
          const path = await AppActions.openFolderPicker();
          setOutputPath(path);
          RecordingActions.setOutputPath(path);
        }}
      >
        {' '}
        Select output Directory
      </button>
      {recordingInfo &&
        recordingInfo?.monitors?.map((m) => {
          let selected = selectedDisplays?.includes(m.altId);
          return (
            <li
              style={{ backgroundColor: selected ? 'lightgreen' : 'white' }}
              key={m.id}
              onClick={() => {
                // let newDisplays = selected
                //   ? selectedDisplays.filter((d) => d !== m.altId)
                //   : [...selectedDisplays, m.altId];
                setSelectedDisplays(m.altId);
              }}
            >
              {`${m.altId}_${m.friendlyName}`}
            </li>
          );
        })}
      <br />
    </fieldset>
  );
};
export default CaptureOutputGeneral;
