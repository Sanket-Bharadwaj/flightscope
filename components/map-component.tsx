'use client';

import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import useSWR, { mutate as globalMutate } from 'swr';
import { AircraftState, OpenSkyStatesResponse } from '@/lib/types';
import { FlightMarker } from './flight-marker';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { UserLocation } from './user-location';

interface FlightRouteInfo {
  departure: string | null;
  arrival: string | null;
  callsign?: string;
  firstSeen?: number;
  lastSeen?: number;
}

// Fix for default marker icon issue with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'leaflet/images/marker-icon-2x.png',
  iconUrl: 'leaflet/images/marker-icon.png',
  shadowUrl: 'leaflet/images/marker-shadow.png',
});

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const contentType = res.headers.get('content-type');
  
  // Check if response is JSON
  if (!contentType || !contentType.includes('application/json')) {
    console.error('Non-JSON response received:', contentType);
    return { states: [], message: 'API returned invalid response' };
  }
  
  try {
    return await res.json();
  } catch (e) {
    console.error('Failed to parse JSON:', e);
    return { states: [], message: 'Failed to parse API response' };
  }
};

interface MapComponentProps {
  cluster?: boolean;
  refreshInterval?: number; // in ms
}

export default function MapComponent({ cluster = true, refreshInterval = 15000 }: MapComponentProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [flightRoutes, setFlightRoutes] = useState<Map<string, FlightRouteInfo>>(new Map());
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { data, error, isValidating } = useSWR<OpenSkyStatesResponse>('/api/aircraft', fetcher, {
    refreshInterval, // Fetch new data every refreshInterval milliseconds
    revalidateOnFocus: false,
    dedupingInterval: 0, // Disable deduplication to allow rapid updates
    onSuccess: (data) => {
      const now = new Date();
      setLastUpdate(now);
      setIsRefreshing(false);
      console.log(`✈️ Aircraft data updated at ${now.toLocaleTimeString()} - ${data.states?.length || 0} aircraft`);
    },
  });

  useEffect(() => {
    if (isValidating) {
      setIsRefreshing(true);
    }
  }, [isValidating]);

  useEffect(() => {
    setMapLoaded(true);
  }, []);

  useEffect(() => {
    const handleSearch = (e: any) => {
      setSearchQuery(e.detail?.toLowerCase() || '');
    };

    const handleFetchRoute = async (e: any) => {
      const icao24 = e.detail;
      
      if (!icao24) return;
      
      // Check if already fetched
      setFlightRoutes(prev => {
        if (prev.has(icao24)) {
          return prev;
        }
        return prev;
      });
      
      try {
        const response = await fetch(`/api/aircraft/${icao24}`);
        
        if (response.ok) {
          const routeData: FlightRouteInfo = await response.json();
          setFlightRoutes(prev => new Map(prev).set(icao24, routeData));
        }
      } catch (err) {
        console.error('Error fetching route info:', err);
      }
    };

    window.addEventListener('flightscope:searchFlight', handleSearch as EventListener);
    window.addEventListener('flightscope:fetchRoute', handleFetchRoute as EventListener);
    
    return () => {
      window.removeEventListener('flightscope:searchFlight', handleSearch as EventListener);
      window.removeEventListener('flightscope:fetchRoute', handleFetchRoute as EventListener);
    };
  }, []);

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6 max-w-md mx-auto text-center">
        <div className="text-6xl">⚠️</div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">OpenSky API Unavailable</h2>
          <p className="text-sm text-textSecondary mb-1">
            The OpenSky Network API is temporarily unavailable or rate-limited.
          </p>
          <p className="text-xs text-textSecondary">
            This usually resolves in 1-2 minutes. Try increasing your refresh interval to 20+ seconds.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => globalMutate('/api/aircraft')}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
          >
            Retry Now
          </button>
        </div>
      </div>
    );

  if (!data) return <div className="flex items-center justify-center h-full text-textSecondary">Loading map and aircraft data...</div>;

  const aircraftStates = data.states || [];
  const hasApiError = (data as any).message && aircraftStates.length === 0;
  
  // Filter aircraft based on search query
  const filteredAircraft = searchQuery
    ? aircraftStates.filter(aircraft => 
        aircraft.callsign?.toLowerCase().includes(searchQuery) ||
        aircraft.icao24?.toLowerCase().includes(searchQuery)
      )
    : aircraftStates;

  return (
    <div className="relative w-full h-full overflow-hidden bg-background">
      {/* Real-time status indicator */}
      <div className="absolute top-4 left-4 z-[1000] bg-surface/70 backdrop-blur-xl px-3 py-1.5 rounded-lg shadow-lg border border-border/50">
        <div className="flex items-center gap-2 text-xs">
          <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-yellow-500 animate-pulse' : hasApiError ? 'bg-red-500' : 'bg-green-500'}`}></div>
          <span className="text-foreground font-medium">
            {isRefreshing ? 'Updating...' : hasApiError ? 'API Error' : 'Live'}
          </span>
          {lastUpdate && !isRefreshing && !hasApiError && (
            <span className="text-textSecondary">
              • {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          <span className="text-textSecondary">
            • {aircraftStates.length} aircraft
          </span>
        </div>
      </div>

      {mapLoaded && (
        <MapContainer
          center={[20, 0]} // Centered globally
          zoom={3}
          minZoom={2}
          maxZoom={18}
          scrollWheelZoom={true}
          zoomControl={false} // Disable default zoom control
          className="h-full w-full"
          style={{ opacity: mapLoaded ? 1 : 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* User location marker */}
          <UserLocation />

          {cluster ? (
            <MarkerClusterGroup
              chunkedLoading
              maxClusterRadius={100}
              disableClusteringAtZoom={7} // Disable clustering when zoomed in
              spiderfyOnMaxZoom={true}
              showCoverageOnHover={true}
            >
              {filteredAircraft.map((aircraft) => (
                <FlightMarker 
                  key={aircraft.icao24} 
                  aircraft={aircraft}
                  routeInfo={flightRoutes.get(aircraft.icao24)}
                />
              ))}
            </MarkerClusterGroup>
          ) : (
            <>
              {filteredAircraft.map((aircraft) => (
                <FlightMarker 
                  key={aircraft.icao24} 
                  aircraft={aircraft}
                  routeInfo={flightRoutes.get(aircraft.icao24)}
                />
              ))}
            </>
          )}
        </MapContainer>
      )}
    </div>
  );
}
