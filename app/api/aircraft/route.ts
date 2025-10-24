import { NextResponse } from 'next/server';
import { AircraftState, OpenSkyStatesResponse } from '@/lib/types';

const OPENSKY_API_URL = 'https://opensky-network.org/api/states/all';
const MAX_AIRCRAFT_MARKERS = 200; // Limit to 200 aircraft for performance

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const response = await fetch(OPENSKY_API_URL, {
      cache: 'no-store', // Disable caching completely for real-time data
      headers: {
        'User-Agent': 'FlightScope/1.0',
      },
    });

    if (!response.ok) {
      console.error(`OpenSky API error: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.error('Response body:', text.substring(0, 200));
      return NextResponse.json(
        { 
          message: `OpenSky API error: ${response.status}. The API may be rate-limited or temporarily unavailable.`,
          states: [] 
        },
        { status: 200 } // Return 200 with empty states to avoid breaking the UI
      );
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('OpenSky returned non-JSON response:', contentType);
      const text = await response.text();
      console.error('Response body:', text.substring(0, 200));
      return NextResponse.json(
        { 
          message: 'OpenSky API returned invalid response. It may be rate-limited.',
          states: [] 
        },
        { status: 200 }
      );
    }

    const data: OpenSkyStatesResponse = await response.json();

    if (!data || !data.states) {
      return NextResponse.json({ states: [] }, { status: 200 });
    }

    // Filter out invalid states (missing lat/lon) and limit the number of aircraft
    const filteredStates: AircraftState[] = data.states
      .filter(
        (state: any) =>
          state[5] !== null && // longitude
          state[6] !== null && // latitude
          state[0] !== null // icao24
      )
      .map((state: any) => ({
        icao24: state[0],
        callsign: state[1]?.trim() || null,
        origin_country: state[2],
        time_position: state[3],
        last_contact: state[4],
        longitude: state[5],
        latitude: state[6],
        geo_altitude: state[7],
        on_ground: state[8],
        velocity: state[9],
        true_track: state[10],
        vertical_rate: state[11],
        sensors: state[12],
        baro_altitude: state[13],
        squawk: state[14],
        spi: state[15],
        position_source: state[16],
        category: state[17],
      }))
      .slice(0, MAX_AIRCRAFT_MARKERS); // Apply the limit

    return NextResponse.json({ states: filteredStates }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching aircraft data:', error);
    // Return empty states with error message to avoid breaking UI
    return NextResponse.json(
      { 
        message: error?.message || 'Internal Server Error',
        states: [] 
      },
      { status: 200 } // Return 200 to prevent SWR from treating as fatal error
    );
  }
}
