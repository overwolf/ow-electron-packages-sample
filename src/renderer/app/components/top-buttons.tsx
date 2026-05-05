import React, { FC, useContext, useEffect, useState } from 'react';
import AppContext from '../context/app-context';
import { GepActions } from '../api-actions/gep-actions';
import { AppActions } from '../api-actions/app-actions';
import { OsrActions } from '../api-actions/osr-actions';
import { NavLink } from 'react-router-dom';

// -----------------------------------------------------------------------------
const TopButtons: FC = () => {
  const { newLogMessage } = useContext(AppContext)?.logs;

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

  const updateHotkeyClicked = async () => {
    try {
      await OsrActions.updateHotkey();
    } catch (error) {
      newLogMessage('Update hotkey Error');
    }
  };

  const scanGamesClicked = async () => {
    try {
      await AppActions.scanGames();
    } catch (error) {
      newLogMessage(`scan games ${error}`);
    }
  };

  const disableAdsFPD = async () => {
    try {
      await AppActions.disableAdsFPD();
    } catch (error) {
      newLogMessage(`disableAdsFPD ${error}`);
    }
  };

  const hasPendingUpdates = async () => {
    try {
      await AppActions.checkForPendingUpdates();
    } catch (error) {
      newLogMessage(`hasPendingUpdates ${error}`);
    }
  };

  return (
    <>
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
              <button onClick={createDPIOSRClicked} id="createDPIOSR">
                Create DPI OSR
              </button>
            </td>
            <td className="span1 btn">
              <button onClick={showAllOSRClicked} id="visibilityOSR">
                Show all OSR
              </button>
            </td>
          </tr>
          <tr>
            <td className="span1 btn">
              <button onClick={updateHotkeyClicked} id="updateHotkey">
                update Hotkey
              </button>
            </td>
            <td className="span1 btn">
              <button onClick={scanGamesClicked} id="scanGameskey">
                Scan Games
              </button>
            </td>
          </tr>
          <tr>
            <td className="span1 btn">
              <button onClick={disableAdsFPD} id="disableAdsFPD">
                disableAdsFPD
              </button>
            </td>
            <td className="span1 btn">
              <button onClick={hasPendingUpdates} id="hasPendingUpdates">
                hasPendingUpdates
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default TopButtons;
