"use client";

import { useEffect, useState } from 'react';
import MapComponent from './map-component';
import { ThemeToggle } from './theme-toggle';
import { ControlCard } from './control-card';

export default function MapWrapper() {
  const [cluster, setCluster] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(10000);

  useEffect(() => {
    const setClusterListener = (e: any) => setCluster(Boolean(e.detail));
    const setIntervalListener = (e: any) => {
      const val = Number(e.detail);
      if (!Number.isNaN(val) && val > 0) setRefreshInterval(val);
    };

    window.addEventListener('flightscope:setCluster', setClusterListener as EventListener);
    window.addEventListener('flightscope:setRefreshInterval', setIntervalListener as EventListener);

    return () => {
      window.removeEventListener('flightscope:setCluster', setClusterListener as EventListener);
      window.removeEventListener('flightscope:setRefreshInterval', setIntervalListener as EventListener);
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden" style={{ height: 'calc(100vh - var(--header-height))' }}>
      <div className="absolute inset-0 z-0">
        <MapComponent cluster={cluster} refreshInterval={refreshInterval} />
      </div>

      {/* Control card overlay (bottom center) - always above map */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
        <ControlCard />
      </div>
    </div>
  );
}
