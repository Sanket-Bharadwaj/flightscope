export interface AircraftState {
  icao24: string; // 0: ICAO24 address of the transmitter in hex string representation.
  callsign: string | null; // 1: Callsign of the vehicle (8 chars). Can be null.
  origin_country: string; // 2: Country of origin inferred from the ICAO24 address.
  time_position: number | null; // 3: Unix timestamp (seconds) for the last position update. Can be null.
  last_contact: number; // 4: Unix timestamp (seconds) for the last update in general.
  longitude: number | null; // 5: WGS-84 longitude in decimal degrees. Can be null.
  latitude: number | null; // 6: WGS-84 latitude in decimal degrees. Can be null.
  geo_altitude: number | null; // 7: Geometric altitude in meters. Can be null.
  on_ground: boolean; // 8: True if the aircraft is on ground.
  velocity: number | null; // 9: Velocity over ground in m/s. Can be null.
  true_track: number | null; // 10: True track in decimal degrees (0 to 359.9). Can be null.
  vertical_rate: number | null; // 11: Vertical rate in m/s. Can be null.
  sensors: number[] | null; // 12: Array of sensor IDs. Can be null.
  baro_altitude: number | null; // 13: Barometric altitude in meters. Can be null.
  squawk: string | null; // 14: Squawk code. Can be null.
  spi: boolean; // 15: Special purpose indicator.
  position_source: number; // 16: 0 = ADS-B, 1 = ASTERIX, 2 = MLAT, 3 = FLARM.
  category: number | null; // 17: Aircraft category. Can be null.
}

export interface OpenSkyStatesResponse {
  time: number;
  states: AircraftState[] | null;
}
