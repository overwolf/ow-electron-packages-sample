import React, { FC, useState, useRef, useCallback } from 'react';
import Icon from './layout/icon';
import Ad from './ads-tester/ad';
import PerformanceAd from './ads-tester/performance-ad';
import SectionHeader from './layout/section-header';

const AdView: FC = () => {
  const [selectedLayout, setSelectedLayout] = useState<string>('tall-duo-right');
  const [ad1Size, setAd1Size] = useState<[number, number]>([160, 600]);
  const [ad2Size, setAd2Size] = useState<[number, number]>([400, 600]);
  const [isHighImpactActive, setIsHighImpactActive] = useState<boolean>(false);
  
  const adZoneRef = useRef<HTMLDivElement>(null);
  const hiddenElementsRef = useRef<HTMLElement[]>([]);

  // Check if the current layout has high impact enabled
  const isHighImpactLayout = selectedLayout === 'tower-plus-high-impact';
  
  // Determine which ad slot has the 400x600 size (the one that gets high impact)
  const ad1HasHighImpact = isHighImpactLayout && ad1Size[0] === 400 && ad1Size[1] === 600;
  const ad2HasHighImpact = isHighImpactLayout && ad2Size[0] === 400 && ad2Size[1] === 600;

  //----------------------------------------------------------------------------
  const handleHighImpactAdLoaded = useCallback((adWrapperClass: string) => {
    console.log('- High impact ad loaded, expanding within ad zone');
    setIsHighImpactActive(true);
    
    if (!adZoneRef.current) return;
    
    // Find the ad wrapper that triggered the high impact within the ad zone
    const adWrapper = adZoneRef.current.querySelector(`.${adWrapperClass}`) as HTMLElement;
    if (!adWrapper) return;
    
    // Store and hide all sibling elements within the ad zone (other ad containers)
    hiddenElementsRef.current = [];
    Array.from(adZoneRef.current.children).forEach((child) => {
      if (child !== adWrapper && child instanceof HTMLElement) {
        hiddenElementsRef.current.push(child);
        child.style.display = 'none';
      }
    });
    
    // Expand the ad wrapper to fill the ad zone
    adWrapper.style.width = '100%';
    adWrapper.style.height = '100%';
    adWrapper.style.flex = '1';
  }, []);

  //----------------------------------------------------------------------------
  const handleHighImpactAdRemoved = useCallback(() => {
    console.log('- High impact ad removed, restoring ad zone');
    setIsHighImpactActive(false);
    
    if (!adZoneRef.current) return;
    
    // Restore all previously hidden elements within the ad zone
    hiddenElementsRef.current.forEach((element) => {
      element.style.display = '';
    });
    hiddenElementsRef.current = [];
    
    // Reset all ad wrapper styles within the ad zone
    const adWrappers = adZoneRef.current.querySelectorAll('.ad-wrapper');
    adWrappers.forEach((wrapper) => {
      if (wrapper instanceof HTMLElement) {
        wrapper.style.width = '';
        wrapper.style.height = '';
        wrapper.style.flex = '';
      }
    });
  }, []);

  //----------------------------------------------------------------------------
  const handleLayoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedLayout(value);
    console.log('- Selected layout:', value);

    switch(value) {
      case 'tall-duo-right':
        setAd1Size([160, 600]);
        setAd2Size([400, 600]);
        break;
      case 'tall-duo-left':
        setAd1Size([400, 600]);
        setAd2Size([160, 600]);
        break;
      case 'combo-classic-right':
        setAd1Size([300, 250]);
        setAd2Size([400, 600]);
        break;
      case 'combo-classic-left':
        setAd1Size([400, 600]);
        setAd2Size([300, 250]);
        break;
      case 'studio-tower-right':
        setAd1Size([160, 600]);
        setAd2Size([300, 250]);
        break;
      case 'studio-tower-left':
        setAd1Size([300, 250]);
        setAd2Size([160, 600]);
        break;
      case 'tower-right':
        setAd1Size([728, 90]);
        setAd2Size([400, 600]);
        break;
      case 'tower-left':
        setAd1Size([400, 600]);
        setAd2Size([728, 90]);
        break;
      case 'tower-plus-right':
        setAd1Size([400, 60]);
        setAd2Size([400, 600]);
        break;
      case 'tower-plus-left':
        setAd1Size([400, 600]);
        setAd2Size([400, 60]);
        break;
      case 'tower-plus-high-impact':
        setAd1Size([400, 60]);
        setAd2Size([400, 600]);
        break;
      case 'studio-right':
        setAd1Size([728, 90]);
        setAd2Size([400, 300]);
        break;
      case 'studio-left':
        setAd1Size([400, 300]);
        setAd2Size([728, 90]);
        break;
      case 'studio-plus-right':
        setAd1Size([400, 60]);
        setAd2Size([400, 300]);
        break;
      case 'studio-plus-left':
        setAd1Size([400, 300]);
        setAd2Size([400, 60]);
        break;
    }

  };

  //----------------------------------------------------------------------------
  return (
    <section className="views ads-tester-section">
      <div className='logger-and-actions'>
          <SectionHeader
            title='Ad layouts'
            description='Preview ad layouts and track events'
          />
          <div className='layout-actions'>
            <div className='select-layout'>
              <label htmlFor='layout-select'>Ad layout</label>
              <select id='layout-select' value={selectedLayout} onChange={handleLayoutChange}>
              <option value={'tower-plus-high-impact'}>Tower Plus + High Impact</option>
                <option value={'tall-duo-right'}>Tall Duo (right)</option>
                <option value={'tall-duo-left'}>Tall Duo (left)</option>
                <option value={'combo-classic-right'}>Combo Classic (right)</option>
                <option value={'combo-classic-left'}>Combo Classic (left)</option>
                <option value={'studio-tower-right'}>Studio Tower (right)</option>
                <option value={'studio-tower-left'}>Studio Tower (left)</option>
                <option value={'tower-right'}>Tower (right)</option>
                <option value={'tower-left'}>Tower (left)</option>
                <option value={'tower-plus-right'}>Tower Plus (right)</option>
                <option value={'tower-plus-left'}>Tower Plus (left)</option>
                <option value={'studio-right'}>Studio (right)</option>
                <option value={'studio-left'}>Studio (left)</option>
                <option value={'studio-plus-right'}>Studio Plus (right)</option>
                <option value={'studio-plus-left'}>Studio Plus (left)</option>
              </select>
            </div>
            <PerformanceAd />
          </div>
      </div>

      <div className={`app-layout-container ${isHighImpactActive ? 'high-impact-expanded' : ''}`}>
        <div className='app-layout-header'>
          <Icon name="electronLogo" className='electron-logo' />
          <Icon name="fakeButtons" className='fake-icons' />
        </div>

        <div className={`app-layout-main ${selectedLayout}`}>

          {/* Tower Plus + High Impact layout: ad zone on the right with high impact enabled */}
          {selectedLayout === 'tower-plus-high-impact' ? (
            <>
              <div className='main-area'></div>
              <div className='ad-zone ad-zone-right' ref={adZoneRef}>
                <Ad
                  adSize={ad1Size}
                  id={'owadview-container'}
                  adName={'ad1'}
                  adViewIsActive={false}
                  enableHighImpact={ad1HasHighImpact}
                  onHighImpactAdLoaded={() => handleHighImpactAdLoaded('ad1-wrapper')}
                  onHighImpactAdRemoved={handleHighImpactAdRemoved}
                  wrapperClassName='ad1-wrapper'
                />
                <Ad
                  adSize={ad2Size}
                  id={'owadview-container2'}
                  adName={'ad2'}
                  adViewIsActive={false}
                  enableHighImpact={ad2HasHighImpact}
                  onHighImpactAdLoaded={() => handleHighImpactAdLoaded('ad2-wrapper')}
                  onHighImpactAdRemoved={handleHighImpactAdRemoved}
                  wrapperClassName='ad2-wrapper'
                />
              </div>
            </>
          ) : (
            /* Standard layout for all other options */
            <>
              <div className='left-col'>
                <Ad
                  adSize={ad1Size}
                  id={'owadview-container'}
                  adName={'ad1'}
                  adViewIsActive={false}
                />
              </div>
              <div className='main-area'></div>
              <div className='right-col'>
                <Ad
                  adSize={ad2Size}
                  id={'owadview-container2'}
                  adName={'ad2'}
                  adViewIsActive={false}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdView;
