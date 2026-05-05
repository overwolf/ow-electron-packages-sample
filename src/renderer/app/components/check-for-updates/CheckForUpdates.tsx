import React, { FC, useEffect, useState } from 'react';
import { AppActions } from '../../api-actions/app-actions';

const CheckForUpdates: FC = () => {
  const handleCheckForUpdates = async () => {
    try {
      await AppActions.checkForUpdates();
    } catch (error) {
      console.log(`manageCMP ${error}`);
    }
  };

  return (
    <div className="cmp-settings">
      <button onClick={handleCheckForUpdates} className="btn-secondary">
        Check for Updates
      </button>
    </div>
  );
};

export default CheckForUpdates;
