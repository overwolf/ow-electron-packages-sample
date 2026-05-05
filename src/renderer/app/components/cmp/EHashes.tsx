import React, { FC, useState } from 'react';
import { AppActions } from '../../api-actions/app-actions';

// -----------------------------------------------------------------------------
const EHashes: FC = () => {
  const [email, setEmail] = useState('');

  //----------------------------------------------------------------------------
  const handleGenerateEmailHashes = async () => {
    try {
      await AppActions.generateEmailHashes(email);
    } catch (error) {
      console.error(`Error generating email hashes: ${error}`);
    }
  };
  //----------------------------------------------------------------------------

  return (
    <div className="cmp-settings">
      <input
        type="text"
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="btn-secondary" onClick={handleGenerateEmailHashes}>
        Save
      </button>
    </div>
  );
};

export default EHashes;
