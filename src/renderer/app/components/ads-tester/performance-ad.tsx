import React, { FC } from 'react';

const PerformanceAd: FC = () => {

 const performanceEvents = [
    'complete',
    'impression',
    'shutdown',
    'performance_ad_no_fill',
    'performance_ad_dismiss',
    'performance_ad_loaded',
    'performance_ad_clicked',
    'performance_ad_video_complete',
    'performance_ad_video_skipped',
    ];


  //----------------------------------------------------------------------------
  function performanceAd() {
    const performanceAdview = document.createElement('owadview');
    performanceAdview.setAttribute('performance', '');
    // performanceAdview.setAttribute('unit', 'lunar_performance');

    performanceEvents.forEach((event) => {
      performanceAdview.addEventListener(event, () => {
        console.log('- ', `performance ad - ${event}`);
      });
    });

    // Append the performance adview to the body element
    document.body.appendChild(performanceAdview);
  }

  //----------------------------------------------------------------------------
  return (
    <button 
      className='btn-secondary' 
      id="performanceAdButton" 
      onClick={performanceAd}
    >
      Performance ad
    </button>
  );
};

export default PerformanceAd;
