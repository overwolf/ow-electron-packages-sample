import React, { FC, useRef, useState } from 'react';

interface AdProps {
  adSize: [number, number];
  id: string;
  adName: string;
  adViewIsActive: boolean;
  enableHighImpact?: boolean;
  onHighImpactAdLoaded?: () => void;
  onHighImpactAdRemoved?: () => void;
  wrapperClassName?: string;
}

const Ad: FC<AdProps> = ({ 
  adSize, 
  id, 
  adName, 
  adViewIsActive, 
  enableHighImpact = false,
  onHighImpactAdLoaded,
  onHighImpactAdRemoved,
  wrapperClassName = ''
}) => {
  const [adviewActive, setAdviewActive] = useState<boolean>(adViewIsActive);
  const [isHighImpactActive, setIsHighImpactActive] = useState<boolean>(false);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const adViewRef = useRef<HTMLElement | null>(null);

  //----------------------------------------------------------------------------
  function startAd() {
    console.log('-', adName, `${adSize[0]}x${adSize[1]}`, 'startAdButton clicked', { enableHighImpact });

    if (adviewActive || adViewRef.current != null) {
      return;
    }

    const tempAdView = document.createElement('owadview');
    tempAdView.setAttribute('id', 'mainAd');
    tempAdView.setAttribute('cid', 'mainAd');
    tempAdView.setAttribute('slotsize', `${adSize[0]}x${adSize[1]}`);
    
    // Enable high impact ads via adstyle attribute (per Overwolf API)
    if (enableHighImpact) {
      tempAdView.setAttribute('adstyle', 'high-impact-ad;');
    }

    // Webview events
    tempAdView.addEventListener('impression', (args) => {
      console.log('-', adName, `${adSize[0]}x${adSize[1]}`, 'owadview - video impression', args);
    });
    tempAdView.addEventListener('display_ad_loaded', (args) => {
      console.log('-', adName, `${adSize[0]}x${adSize[1]}`, 'owadview - display_ad_loaded', args);
    });
    tempAdView.addEventListener('player_loaded', (args) => {
      console.log('-', adName, `${adSize[0]}x${adSize[1]}`, 'owadview - player_loaded ', args);
    });
    tempAdView.addEventListener('play', (args) => {
      console.log('-', adName, `${adSize[0]}x${adSize[1]}`, 'owadview - video play ', args);
    });
    tempAdView.addEventListener('complete', (args) => {
      console.log('-', adName, `${adSize[0]}x${adSize[1]}`, 'owadview - video complete ', args);
    });
    tempAdView.addEventListener('ad-clicked', (args) => {
      console.log('-', adName, `${adSize[0]}x${adSize[1]}`, 'owadview - ad clicked ', args);
    });
    tempAdView.addEventListener('house_ad_action', (args) => {
      console.log('-', adName, `${adSize[0]}x${adSize[1]}`, 'house_ad clicked ', args);
    });

    // High impact ad event listeners (only when enabled)
    if (enableHighImpact) {
      tempAdView.addEventListener('high-impact-ad-loaded', () => {
        console.log('-', adName, 'High impact ad loaded');
        setIsHighImpactActive(true);
        
        if (adContainerRef.current) {
          // High impact ad expands to fill the ad zone (parent container)
          adContainerRef.current.style.width = '100%';
          adContainerRef.current.style.height = '100%';
        }
        
        // Notify parent to remove other elements from ad zone
        onHighImpactAdLoaded?.();
      });

      tempAdView.addEventListener('high-impact-ad-removed', () => {
        console.log('-', adName, 'High impact ad removed');
        setIsHighImpactActive(false);
        
        if (adContainerRef.current) {
          // Restore ad container to original size
          adContainerRef.current.style.width = `${adSize[0]}px`;
          adContainerRef.current.style.height = `${adSize[1]}px`;
        }
        
        // Notify parent to restore other elements in ad zone
        onHighImpactAdRemoved?.();
      });
    }

    adViewRef.current = tempAdView;
    if (adContainerRef.current) {
      adContainerRef.current.appendChild(tempAdView);
    }

    setAdviewActive(true);
  }

  //----------------------------------------------------------------------------
  function stopAd() {
    if (!adviewActive || adViewRef.current == null) {
      return;
    }

    if (adContainerRef.current && adViewRef.current) {
      adContainerRef.current.removeChild(adViewRef.current);
    }

    // Reset container size if high impact was active
    if (isHighImpactActive && adContainerRef.current) {
      adContainerRef.current.style.width = `${adSize[0]}px`;
      adContainerRef.current.style.height = `${adSize[1]}px`;
      onHighImpactAdRemoved?.();
    }

    adViewRef.current = null;
    setAdviewActive(false);
    setIsHighImpactActive(false);
  }

  //----------------------------------------------------------------------------
  return (
    <div className={`ad-wrapper ${wrapperClassName} ${isHighImpactActive ? 'high-impact-active' : ''}`}>
      <div
        id={id}
        className='ad-container'
        ref={adContainerRef}
        style={{width: `${adSize[0]}px`, height: `${adSize[1]}px`}}
      >
      </div>

      <div className='ad-actions'>
          <span>{adName}{enableHighImpact ? ' (HI)' : ''}:</span>
         <button className='ad-btn' id="startAdButton" onClick={startAd}>
          startAd
        </button>
        <button className='ad-btn' id="stopAdButton" onClick={stopAd}>
          removeAd
        </button>
      </div>

    </div>
  );
};

export default Ad;
