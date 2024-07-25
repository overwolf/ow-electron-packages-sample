import React, { FC, useContext, useEffect, useState } from 'react';
import AppContext from '../context/app-context';
import { GepActions } from '../api-actions/gep-actions';
import { AppActions } from '../api-actions/app-actions';
import { OverlayActions } from '../api-actions/overlay-actions';
import { OsrActions } from '../api-actions/ocr-actions';

// -----------------------------------------------------------------------------
const TopButtons: FC = () => {
  const [version, setVersion] = useState('');
  const { newLogMessage } = useContext(AppContext)?.logs;

  useEffect(() => {
    setVersion(AppActions.version);
  }, []);

  const setRequiredFeaturesClicked = async () => {
    try {
      await GepActions.setRequiredFeature();
      newLogMessage('setRequiredFeatures ok');
    } catch (error) {
      newLogMessage(`setRequiredFeatures ${error}`);
    }
  };

  const getInfoClicked = async () => {
    try {
      const info = await GepActions.getInfo();
      let logResponse = typeof info === 'string' ? info : JSON.stringify(info);
      newLogMessage(logResponse);
    } catch (error) {
      newLogMessage('getInfo error');
      alert('getInfo error' + error);
    }
  };

  const createOSRClicked = async () => {
    try {
      await OsrActions.openOSR();
    } catch (error) {
      newLogMessage('createOSR error');
    }
  };

  const showAllOSRClicked = async () => {
    try {
      await OsrActions.toggle();
    } catch (error) {
      newLogMessage('toggle osr error');
    }
  };

  const updateHotkeyClicked = async () => {
    try {
      await OsrActions.updateHotkey();
    } catch (error) {
      newLogMessage('Update hotkey Error');
    }
  };

  return (
    <>
      <ul className="versions code">
        <li className="electron-version">{version}</li>
      </ul>
      <table className="span12">
        <tbody>
          <tr>
            <td className="span1 btn">
              <button
                onClick={setRequiredFeaturesClicked}
                id="setRequiredFeaturesBtn"
              >
                setRequiredFeatures
              </button>
            </td>
            <td className="span1 btn">
              <button onClick={getInfoClicked} id="getInfoBtn">
                getInfo
              </button>
            </td>
            <td className="span1 btn">
              <button onClick={createOSRClicked} id="createOSR">
                Create OSR
              </button>
            </td>
            <td className="span1 btn">
              <button onClick={showAllOSRClicked} id="visibilityOSR">
                Show all OSR
              </button>
            </td>
            <td className="span1 btn">
              <button onClick={updateHotkeyClicked} id="updateHotkey">
                update Hotkey
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default TopButtons;
