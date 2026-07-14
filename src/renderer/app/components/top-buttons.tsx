import React, { FC, useContext, useState } from 'react';
import AppContext from '../context/app-context';
import { GepActions } from '../api-actions/gep-actions';
import { AppActions } from '../api-actions/app-actions';
import { OsrActions } from '../api-actions/osr-actions';

const TopButtons: FC = () => {
  const { newLogMessage } = useContext(AppContext)?.logs;
  const [trackedClassId, setTrackedClassId] = useState('25322');

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

  const createDPIOSRClicked = async () => {
    try {
      await OsrActions.openDPIOSR();
    } catch (error) {
      newLogMessage('createDPIOSR error');
    }
  };

  const showAllOSRClicked = async () => {
    try {
      await OsrActions.toggle();
    } catch (error) {
      newLogMessage('toggle osr error');
    }
  };

  const scanGamesClicked = async () => {
    try {
      await AppActions.scanGames();
    } catch (error) {
      newLogMessage(`scan games ${error}`);
    }
  };

  const trackSpecificClassIdClicked = async () => {
    const classId = Number.parseInt(trackedClassId, 10);

    if (Number.isNaN(classId)) {
      newLogMessage('track specific classId requires a numeric value');
      return;
    }

    try {
      const result = await AppActions.trackGames(classId);
      const formattedResult =
        typeof result === 'string' ? result : JSON.stringify(result);
      newLogMessage(`tracking utility events for classId ${classId}`);
      newLogMessage(formattedResult);
    } catch (error) {
      newLogMessage(`track specific classId ${error}`);
    }
  };

  const disableAdsFPD = async () => {
    try {
      await AppActions.disableAdsFPD();
    } catch (error) {
      newLogMessage(`disableAdsFPD ${error}`);
    }
  };

  const disableAdsOptimization = async () => {
    try {
      await AppActions.disableAdsOptimization();
    } catch (error) {
      newLogMessage(`disableAdsOptimization ${error}`);
    }
  };

  const hasPendingUpdates = async () => {
    try {
      await AppActions.checkForPendingUpdates();
    } catch (error) {
      newLogMessage(`hasPendingUpdates ${error}`);
    }
  };

  const getUtmParams = async () => {
    try {
      const result = await AppActions.utmParams();
      newLogMessage(`utmParams: ${result}`);
    } catch (error) {
      newLogMessage(`utmParams ${error}`);
    }
  };

  return (
    <div className="top-buttons-panel">
      <table className="span12 top-buttons-table">
        <tbody>
          <tr>
            <td className="span1 btn">
              <button
                className="btn-secondary"
                onClick={setRequiredFeaturesClicked}
                id="setRequiredFeaturesBtn"
              >
                setRequiredFeatures
              </button>
            </td>
            <td className="span1 btn">
              <button className="btn-secondary" onClick={getInfoClicked} id="getInfoBtn">
                getInfo
              </button>
            </td>
            <td className="span1 btn">
              <button className="btn-secondary" onClick={createOSRClicked} id="createOSR">
                Create OSR
              </button>
            </td>
            <td className="span1 btn">
              <button className="btn-secondary" onClick={createDPIOSRClicked} id="createDPIOSR">
                Create DPI OSR
              </button>
            </td>
            <td className="span1 btn">
              <button className="btn-secondary" onClick={showAllOSRClicked} id="visibilityOSR">
                Show all OSR
              </button>
            </td>
          </tr>
          <tr>
          </tr>
          <tr>
            <td className="span1 btn">
              <div className="top-buttons-track-group">
                <input
                  id="trackSpecificClassId"
                  type="number"
                  value={trackedClassId}
                  onChange={(event) => setTrackedClassId(event.target.value)}
                  placeholder="classId"
                />
                <button
                  className="btn-secondary"
                  onClick={trackSpecificClassIdClicked}
                  id="trackSpecificClassIdButton"
                >
                  Track classId
                </button>
              </div>
            </td>
            <td className="span1 btn">
              <button className="btn-secondary" onClick={disableAdsFPD} id="disableAdsFPD">
                disableAdsFPD
              </button>
            </td>
            <td className="span1 btn">
              <button
                className="btn-secondary"
                onClick={disableAdsOptimization}
                id="disableAdsOptimization"
              >
                disableAdsOptimization
              </button>
            </td>
            <td className="span1 btn">
              <button className="btn-secondary" onClick={hasPendingUpdates} id="hasPendingUpdates">
                hasPendingUpdates
              </button>
            </td>
            <td className="span1 btn">
              <button className="btn-secondary" onClick={scanGamesClicked} id="scanGameskey">
                Scan Games
              </button>
            </td>
            <td className="span1 btn">
              <button className="btn-secondary" onClick={getUtmParams} id="getUtmParams">
                utmParams
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TopButtons;
