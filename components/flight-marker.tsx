'use client';

import { Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { AircraftState } from '@/lib/types';
import { Plane, Share2, PlaneTakeoff, PlaneLanding } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRef, useState } from 'react';

interface FlightRouteInfo {
  departure: string | null;
  arrival: string | null;
  callsign?: string;
  firstSeen?: number;
  lastSeen?: number;
}

interface FlightMarkerProps {
  aircraft: AircraftState;
  routeInfo?: FlightRouteInfo;
}

const createPlaneIcon = (heading: number | null, isSelected: boolean) => {
  const rotation = heading !== null ? heading : 0;
  const size = isSelected ? 36 : 28;
  const scale = isSelected ? 1.15 : 1;
  const yellow = '#FACC15'; // solid yellow

  // A320-like top-down silhouette (simplified), solid fill with white outline
  return L.divIcon({
    html: `
      <div style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;transform:rotate(${rotation}deg) scale(${scale});filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4));">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
          <!-- Fuselage -->
          <path d="M50 6 L55 18 L55 70 L50 78 L45 70 L45 18 Z" fill="${yellow}" stroke="#ffffff" stroke-width="2" />
          <!-- Nose cone -->
          <path d="M45 18 L50 10 L55 18 Z" fill="${yellow}" stroke="#ffffff" stroke-width="2" />
          <!-- Main wings -->
          <path d="M22 44 L45 48 L45 54 L22 58 Z" fill="${yellow}" stroke="#ffffff" stroke-width="2" />
          <path d="M78 44 L55 48 L55 54 L78 58 Z" fill="${yellow}" stroke="#ffffff" stroke-width="2" />
          <!-- Engines under wings (stylized) -->
          <ellipse cx="36" cy="52" rx="4" ry="3.5" fill="${yellow}" stroke="#ffffff" stroke-width="1.5"/>
          <ellipse cx="64" cy="52" rx="4" ry="3.5" fill="${yellow}" stroke="#ffffff" stroke-width="1.5"/>
          <!-- Horizontal tail -->
          <path d="M32 30 L45 32 L45 35 L32 36 Z" fill="${yellow}" stroke="#ffffff" stroke-width="1.5" />
          <path d="M68 30 L55 32 L55 35 L68 36 Z" fill="${yellow}" stroke="#ffffff" stroke-width="1.5" />
          <!-- Vertical stabilizer -->
          <path d="M49 6 L50 16 L51 6 Z" fill="${yellow}" stroke="#ffffff" stroke-width="1.5" />
        </svg>
      </div>
    `,
    className: 'plane-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

export function FlightMarker({ aircraft, routeInfo }: FlightMarkerProps) {
  const map = useMap();
  const [isSelected, setIsSelected] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);
  const popupHoverRef = useRef(false);
  const [copied, setCopied] = useState(false);

  if (aircraft.latitude === null || aircraft.longitude === null) {
    return null;
  }

  const position: L.LatLngExpression = [aircraft.latitude, aircraft.longitude];
  const heading = aircraft.true_track; // Use true_track for heading

  const bindPopupHoverHandlers = (marker: L.Marker) => {
    const popup = marker.getPopup();
    if (!popup) return;
    const el = popup.getElement();
    if (!el) return;
    // Avoid duplicate bindings
    if ((el as any)._hoverBound) return;
    (el as any)._hoverBound = true;

    el.addEventListener('mouseenter', () => {
      popupHoverRef.current = true;
      // ensure visible
      el.classList.remove('fade-out');
      el.classList.add('fade-in');
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    });
    el.addEventListener('mouseleave', () => {
      popupHoverRef.current = false;
      el.classList.remove('fade-in');
      el.classList.add('fade-out');
      // close shortly after leaving popup
      closeTimeoutRef.current = window.setTimeout(() => {
        try {
          marker.closePopup();
        } catch {}
      }, 150);
    });
  };

  const handleMarkerClick = (e?: any) => {
    setIsSelected(true);
    
    // Dispatch event to fetch route info if not already loaded
    if (!routeInfo) {
      window.dispatchEvent(new CustomEvent('flightscope:fetchRoute', { detail: aircraft.icao24 }));
    }
    
    map.flyTo(position, map.getZoom() < 8 ? 8 : map.getZoom(), {
      duration: 1.0,
    });
    // Ensure popup opens (especially on mobile) and is visible (remove fade-out)
    const marker: L.Marker | undefined = e?.target;
    if (marker && typeof marker.openPopup === 'function') {
      // Slight delay to avoid fighting the map pan animation
      setTimeout(() => {
        try {
          const popup = marker.getPopup();
          if (popup) {
            const el = popup.getElement();
            if (el) {
              el.classList.remove('fade-out');
              el.classList.add('fade-in');
            }
          }
          marker.openPopup();
          bindPopupHoverHandlers(marker);
        } catch {}
      }, 120);
    }
    setTimeout(() => setIsSelected(false), 1500);
  };

  const planeIcon = createPlaneIcon(heading, isSelected);

  const handleShare = () => {
    const shareData = {
      title: `Flight ${aircraft.callsign || aircraft.icao24}`,
      text: `Check out this flight: ${aircraft.callsign || 'Unknown'} from ${aircraft.origin_country || 'Unknown'}`,
      url: `${window.location.origin}?flight=${aircraft.icao24}`,
    };

    const isMobile = typeof window !== 'undefined' &&
      window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    if (isMobile && navigator.share) {
      navigator.share(shareData).catch(() => {
        // Fallback to clipboard on mobile if share fails
        navigator.clipboard.writeText(`${shareData.title} - ${shareData.url}`).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      });
      return;
    }

    // Desktop: always copy to clipboard with feedback
    navigator.clipboard.writeText(`${shareData.title} - ${shareData.url}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <Marker 
      position={position} 
      icon={planeIcon} 
      eventHandlers={{ 
        click: (e) => handleMarkerClick(e),
        mouseover: (e) => {
          // Apply hover behavior only on devices that support hover
          if (window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            const marker = e.target as L.Marker;
            const popup = marker.getPopup();
            if (popup) {
              const el = popup.getElement();
              if (el) {
                el.classList.remove('fade-out');
                el.classList.add('fade-in');
              }
            }
            marker.openPopup();
            bindPopupHoverHandlers(marker);
          }
        },
        mouseout: (e) => {
          if (window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            const marker = e.target as L.Marker;
            const popup = marker.getPopup();
            if (popup) {
              const el = popup.getElement();
              if (el) {
                el.classList.remove('fade-in');
                el.classList.add('fade-out');
              }
            }
            // Only close if the pointer is not over the popup
            if (closeTimeoutRef.current) {
              window.clearTimeout(closeTimeoutRef.current);
              closeTimeoutRef.current = null;
            }
            closeTimeoutRef.current = window.setTimeout(() => {
              if (!popupHoverRef.current) {
                try {
                  marker.closePopup();
                } catch {}
              }
            }, 150);
          }
        }
      }}
    >
      <Popup 
        className="rounded-xl shadow-xl border-none max-w-xs"
        closeButton={true}
        autoClose={false}
        closeOnClick={false}
      >
        <div className="font-sans text-sm p-3 bg-surface/80 backdrop-blur-xl rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-md border border-white/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-1-.1-1.4.2-1.1.8-1.2 2.5-.6 3.4l4.2 6 6 4.2c.9.6 2.6.5 3.4-.6.3-.4.3-.9.2-1.4z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <h3 className="font-bold text-base text-foreground">{aircraft.callsign || 'Unknown Flight'}</h3>
                <span className="text-xs text-textSecondary">{aircraft.icao24}</span>
              </div>
              <p className="text-xs text-textSecondary">{aircraft.origin_country || 'Unknown origin'}</p>
            </div>
          </div>

          {/* Route Information - Always show */}
          <div className="mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 flex-1">
                <PlaneTakeoff className="h-3.5 w-3.5 text-green-500" />
                <div>
                  <div className="text-[10px] text-textSecondary">Departure</div>
                  <div className="font-semibold text-foreground">
                    {routeInfo?.departure || <span className="opacity-50">Unknown</span>}
                  </div>
                </div>
              </div>
              
              <div className="text-textSecondary">→</div>
              
              <div className="flex items-center gap-1.5 flex-1">
                <PlaneLanding className="h-3.5 w-3.5 text-blue-500" />
                <div>
                  <div className="text-[10px] text-textSecondary">Arrival</div>
                  <div className="font-semibold text-foreground">
                    {routeInfo?.arrival || <span className="opacity-50">Unknown</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-textSecondary">
            <div>
              <div className="text-foreground font-semibold">Altitude</div>
              <div>{aircraft.geo_altitude ? `${Math.round(aircraft.geo_altitude * 3.28084)} ft` : 'N/A'}</div>
            </div>
            <div>
              <div className="text-foreground font-semibold">Ground Speed</div>
              <div>{aircraft.velocity ? `${Math.round(aircraft.velocity * 1.94384)} kt` : 'N/A'}</div>
            </div>
            <div>
              <div className="text-foreground font-semibold">Track</div>
              <div>{aircraft.true_track ? `${Math.round(aircraft.true_track)}°` : 'N/A'}</div>
            </div>
            <div>
              <div className="text-foreground font-semibold">Squawk</div>
              <div>{aircraft.squawk || '—'}</div>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
          >
            <Share2 className="h-4 w-4" />
            <span className="text-sm font-medium">{copied ? 'Copied!' : 'Share Flight'}</span>
          </button>
        </div>
      </Popup>
      <Tooltip
        direction="top"
        offset={[0, -12]}
        opacity={0.9}
        permanent={false}
        className="rounded-lg shadow-md border-none bg-surface/70 backdrop-blur-xl text-foreground text-xs py-1 px-2"
      >
        <div className="font-medium">{aircraft.callsign || aircraft.icao24 || 'Unknown Flight'}</div>
      </Tooltip>
    </Marker>
  );
}
