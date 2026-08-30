import React, { createContext, useContext, useState, useEffect } from 'react';

export type DeviceType = 'smartphone' | 'tablet' | 'laptop' | 'desktop';
export type DeviceModeOverride = 'auto' | 'smartphone' | 'desktop';

interface DeviceContextType {
  deviceType: DeviceType;
  effectiveDevice: 'smartphone' | 'desktop';
  isSmartphone: boolean;
  isTablet: boolean;
  isLaptop: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  orientation: 'portrait' | 'landscape';
  screenWidth: number;
  screenHeight: number;
  deviceMode: DeviceModeOverride;
  setDeviceMode: (mode: DeviceModeOverride) => void;
  toggleDeviceMode: () => void;
  detectedName: string;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

const STORAGE_KEY = 'schoollink_device_mode_override';

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [screenWidth, setScreenWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const [screenHeight, setScreenHeight] = useState<number>(
    typeof window !== 'undefined' ? window.innerHeight : 800
  );
  const [isTouch, setIsTouch] = useState<boolean>(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [deviceMode, setDeviceModeState] = useState<DeviceModeOverride>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY) as DeviceModeOverride;
      if (saved === 'smartphone' || saved === 'desktop' || saved === 'auto') {
        return saved;
      }
    }
    return 'auto';
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setScreenWidth(w);
      setScreenHeight(h);
      setOrientation(w > h ? 'landscape' : 'portrait');

      const hasTouch =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
      setIsTouch(Boolean(hasTouch));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const setDeviceMode = (mode: DeviceModeOverride) => {
    setDeviceModeState(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, mode);
    }
  };

  const toggleDeviceMode = () => {
    if (deviceMode === 'auto') {
      setDeviceMode('smartphone');
    } else if (deviceMode === 'smartphone') {
      setDeviceMode('desktop');
    } else {
      setDeviceMode('auto');
    }
  };

  // Determine native hardware device type
  let detectedType: DeviceType = 'desktop';
  if (screenWidth < 768) {
    detectedType = 'smartphone';
  } else if (screenWidth >= 768 && screenWidth < 1024) {
    detectedType = 'tablet';
  } else if (screenWidth >= 1024 && screenWidth < 1440) {
    detectedType = 'laptop';
  } else {
    detectedType = 'desktop';
  }

  // Effective layout experience taking manual override into account
  let effectiveDevice: 'smartphone' | 'desktop' = 'desktop';
  if (deviceMode === 'smartphone') {
    effectiveDevice = 'smartphone';
  } else if (deviceMode === 'desktop') {
    effectiveDevice = 'desktop';
  } else {
    // Auto mode
    effectiveDevice = detectedType === 'smartphone' ? 'smartphone' : 'desktop';
  }

  const isSmartphone = effectiveDevice === 'smartphone';
  const isTablet = detectedType === 'tablet' && deviceMode === 'auto';
  const isLaptop = detectedType === 'laptop' && deviceMode === 'auto';
  const isDesktop = effectiveDevice === 'desktop' && detectedType === 'desktop';

  // Human readable detection label
  let detectedName = 'Desktop PC';
  if (screenWidth < 768) {
    detectedName = isTouch ? 'Smartphone (Touch)' : 'Mobile Viewport';
  } else if (screenWidth < 1024) {
    detectedName = 'Tablet / iPad';
  } else if (screenWidth < 1440) {
    detectedName = 'Laptop / Ultrabook';
  } else {
    detectedName = 'Desktop Widescreen';
  }

  return (
    <DeviceContext.Provider
      value={{
        deviceType: detectedType,
        effectiveDevice,
        isSmartphone,
        isTablet,
        isLaptop,
        isDesktop,
        isTouch,
        orientation,
        screenWidth,
        screenHeight,
        deviceMode,
        setDeviceMode,
        toggleDeviceMode,
        detectedName,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = (): DeviceContextType => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};
