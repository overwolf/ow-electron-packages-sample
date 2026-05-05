import React, { FC, useEffect, useState } from 'react';
import { AppActions } from '../../api-actions/app-actions';
import EHashes from './EHashes';
import SetEHashes from './SetEHashes';

const CmpSettings: FC = () => {
  const manageCMP = async () => {
    try {
      await AppActions.manageCMP();
    } catch (error) {
      console.log(`manageCMP ${error}`);
    }
  };

  return (
    <div className="cmp-settings">
      {/* QA */}
      <EHashes />
      <SetEHashes />
      {/* QA */}

      <button onClick={manageCMP} className="btn-secondary">
        Manage CMP
      </button>
    </div>
  );
};

export default CmpSettings;
