import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../layout/icon';

type SettingsOptionType = 'simple-type' | 'expanded-type' | 'link-type';

export interface SettingsItemProps {
  type: SettingsOptionType;
  title: string;
  description: string;
  content?: React.ReactNode;
  link?: string;
  isDisabled?: boolean;
  isExpanded?: boolean;
}

const SettingsOptionItem: React.FC<SettingsItemProps> = ({
  type,
  title,
  description,
  content,
  link,
  isDisabled,
  isExpanded = false,
}) => {

  const [isOpen, setIsOpen] = useState(isExpanded);
  const expandContainer = useRef<HTMLDivElement>(null);

  const toggleExpand = () => {
    setIsOpen((prev) => !prev);
  };

 const InfoDetails: React.FC = () => (
    <div className='option-info'>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );

  // if (isDisabled) {
  //   return (
  //     <li className="settings-options-item simple-type">
  //       <div className='is-disabled'>
  //         <InfoDetails />
  //       </div>
  //       <span className='notice-alert info'>
  //         <Icon name="noticeInfoIcon" />
  //         The package isn’t activated
  //       </span>
  //     </li>
  //   );
  // }

  return (
    <li className={`
      settings-options-item 
      ${type} ${isOpen ? 'is-open' : ''} 
    `}>

      {type === 'simple-type' &&
        <>
          <InfoDetails />
          {content}
        </>
      }

      {type === 'link-type' &&
        <Link
          to={link}
          className='settings-item-url'
        >
          <InfoDetails />
          <Icon name="rightArrow" className='item-icon' />
        </Link>
      }

      {type === 'expanded-type' &&
        <>
          <button
            onClick={toggleExpand}
            className='expand-btn'
          >
            <InfoDetails />
            <Icon name="arrowDown" className='item-icon' />
          </button>

          <div
            className='expanded-container'
            ref={expandContainer}
            style={{ maxHeight: isOpen ? `${expandContainer.current?.scrollHeight}px` : '0' }}
          >
            {content}
          </div>
        </>
      }

    </li>
  );

};

export default SettingsOptionItem;
