import React, { useState } from "react";
import Icon from "../layout/icon";

interface ShowMoreOptionsProps {
  children: React.ReactNode;
}

const ShowMoreOptions: React.FC<ShowMoreOptionsProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  const toggleOptions = () => setIsOpen(!isOpen);

  return (
    <div
      className={`show-more-options ${isOpen ? 'is-open' : ''}`}
    >
      <button
        className='show-more-btn'
        onClick={toggleOptions}
      >
        {isOpen ? 'Hide additional options' : 'Additional options'}
        <Icon name="arrowDownSmall" />
      </button>

      <div className='panel-collapsible'>
        <div className='panel-inner'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ShowMoreOptions;