import React, { FC, useState } from 'react';
import { AppActions } from '../../api-actions/app-actions';

// -----------------------------------------------------------------------------
const EHashes: FC = () => {

  const handleSetEmailHashes = async () => {
    try {  
      const hashes = {
        sha1: 'yyy', 
        sha256: 'zzz',
        md5: 'xxx', 
      };
      await AppActions.setUserEmailHashes(hashes);
      } catch (error) {
        console.error(`Error setting email hashes: ${error}`);
      }
  };
  const handleResetEmailHashes = async () => {
    try {  
      const hashes = {
        sha1: '',
        sha256: '',
        md5: '',
  };
      await AppActions.setUserEmailHashes(hashes);
      } catch (error) {
        console.error(`Error setting email hashes: ${error}`);
      }
  };
  //----------------------------------------------------------------------------

  return (
    <div className="cmp-settings">
      <button className="btn-secondary" onClick={handleSetEmailHashes}>
        Set eHashes
      </button>
      <button className="btn-secondary" onClick={handleResetEmailHashes}>
        Reset eHashes
      </button>
    </div>
  );
};

export default EHashes;
