import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './icon';

interface SectionHeaderProps {
  title: string;
  description: string;
  prevPageTitle?: string;
  prevPageRoute?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  prevPageTitle,
  prevPageRoute,
}) => {

  return (
    <div className='page-title'>
      <div className='title-wrapper'>

        {prevPageTitle && prevPageRoute &&
          <>
            <Link to={prevPageRoute}>{prevPageTitle}</Link>
            <Icon name="navRightIcon" />
          </>
        }

        <h2>{title}</h2>
      </div>

      <p>{description}</p>
    </div>
  );

};

export default SectionHeader;
