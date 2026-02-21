export interface PlanetPosition {
  id: number;
  name: string;
  longitude: number;
  latitude: number;
  distance: number;
  speed: number;
  sign: string;
  signDegree: number;
  retrograde: boolean;
  type?: 'planet' | 'point';
}

export interface HouseData {
  cusps: number[];
  angles: {
    ascendant: number;
    mc: number;
    armc: number;
    vertex: number;
    equatorialAscendant: number;
    coAscendant1: number;
    coAscendant2: number;
    polarAscendant: number;
  };
}

export interface AspectData {
  planet1: string;
  planet2: string;
  aspect: string;
  exactAngle: number;
  actualAngle: number;
  orb: number;
  applying: boolean;
}

export interface NatalChartRequest {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second?: number;
  timezone: number;
  latitude: number;
  longitude: number;
  houseSystem?: string;
  zodiacType?: 'tropical' | 'sidereal';
  ayanamsa?: string;
  aspects?: string[];
  planets?: string[];
}

export interface NatalChartResponse {
  input: NatalChartRequest;
  julianDay: number;
  planets: PlanetPosition[];
  houses: HouseData;
  aspects: AspectData[];
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}

export interface DateTimeComponents {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute?: number;
  second?: number;
}

export interface FixedStarPosition {
  name: string;
  longitude: number;
  latitude: number;
  distance: number;
  speed: number;
  magnitude: number | null;
  sign: string;
  signDegree: number;
}

export interface RiseSetResult {
  event: string;
  julianDay: number;
  utc: DateTimeComponents;
}

export interface EclipseResult {
  type: string;
  julianDay: number;
  date: DateTimeComponents;
  maxJulianDay?: number;
}
