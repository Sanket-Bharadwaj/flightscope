'use client';

import { useEffect, useState } from 'react';
import { CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

export function UserLocation() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMap();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setPosition(userPos);
          // Optionally center map on user location
          // map.setView(userPos, 8);
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }
  }, [map]);

  if (!position) return null;

  return (
    <>
      {/* Outer pulse ring */}
      <CircleMarker
        center={position}
        radius={20}
        pathOptions={{
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.1,
          weight: 2,
          opacity: 0.4,
        }}
        className="user-location-pulse"
      />
      {/* Inner dot */}
      <CircleMarker
        center={position}
        radius={8}
        pathOptions={{
          color: '#ffffff',
          fillColor: '#3b82f6',
          fillOpacity: 1,
          weight: 3,
          opacity: 1,
        }}
      >
        <Popup>
          <div className="text-sm font-medium">Your Location</div>
        </Popup>
      </CircleMarker>
    </>
  );
}
