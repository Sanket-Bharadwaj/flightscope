import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface FlightInfo {
  icao24: string;
  firstSeen: number;
  estDepartureAirport: string | null;
  lastSeen: number;
  estArrivalAirport: string | null;
  callsign: string;
  estDepartureAirportHorizDistance: number | null;
  estDepartureAirportVertDistance: number | null;
  estArrivalAirportHorizDistance: number | null;
  estArrivalAirportVertDistance: number | null;
  departureAirportCandidatesCount: number;
  arrivalAirportCandidatesCount: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { icao24: string } }
) {
  try {
    const { icao24 } = params;
    
    // OpenSky flights API - get recent flight info including airports
    const end = Math.floor(Date.now() / 1000);
    const begin = end - 86400; // last 24 hours
    
    const url = `https://opensky-network.org/api/flights/aircraft?icao24=${icao24}&begin=${begin}&end=${end}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 60 }, // cache for 1 min
    });

    if (!response.ok) {
      console.error(`OpenSky flights API error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { 
          departure: null, 
          arrival: null,
          error: 'Failed to fetch flight info'
        },
        { status: 200 } // Return 200 with null data so UI doesn't break
      );
    }

    const flights: FlightInfo[] = await response.json();
    
    // Get the most recent flight (last in array, or first by lastSeen time)
    if (!flights || flights.length === 0) {
      return NextResponse.json({
        departure: null,
        arrival: null,
      });
    }

    // Find the most recent flight (largest lastSeen timestamp)
    const mostRecentFlight = flights.reduce((latest, flight) => 
      flight.lastSeen > latest.lastSeen ? flight : latest
    , flights[0]);

    return NextResponse.json({
      departure: mostRecentFlight.estDepartureAirport,
      arrival: mostRecentFlight.estArrivalAirport,
      callsign: mostRecentFlight.callsign?.trim(),
      firstSeen: mostRecentFlight.firstSeen,
      lastSeen: mostRecentFlight.lastSeen,
    });
  } catch (error: any) {
    console.error('Error fetching flight info:', error);
    return NextResponse.json(
      { 
        departure: null, 
        arrival: null,
        error: error.message 
      },
      { status: 200 } // Return 200 to prevent UI errors
    );
  }
}
