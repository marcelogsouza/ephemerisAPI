declare module 'swisseph-wasm' {
  export default class SwissEph {
    // Constants - Planets
    readonly SE_SUN: 0;
    readonly SE_MOON: 1;
    readonly SE_MERCURY: 2;
    readonly SE_VENUS: 3;
    readonly SE_MARS: 4;
    readonly SE_JUPITER: 5;
    readonly SE_SATURN: 6;
    readonly SE_URANUS: 7;
    readonly SE_NEPTUNE: 8;
    readonly SE_PLUTO: 9;
    readonly SE_EARTH: 14;
    readonly SE_MEAN_NODE: 10;
    readonly SE_TRUE_NODE: 11;
    readonly SE_MEAN_APOG: 12;
    readonly SE_OSCU_APOG: 13;
    readonly SE_CHIRON: 15;
    readonly SE_PHOLUS: 16;
    readonly SE_CERES: 17;
    readonly SE_PALLAS: 18;
    readonly SE_JUNO: 19;
    readonly SE_VESTA: 20;

    // Calendar
    readonly SE_JUL_CAL: 0;
    readonly SE_GREG_CAL: 1;

    // Flags
    readonly SEFLG_JPLEPH: 1;
    readonly SEFLG_SWIEPH: 2;
    readonly SEFLG_MOSEPH: 4;
    readonly SEFLG_HELCTR: 8;
    readonly SEFLG_TRUEPOS: 16;
    readonly SEFLG_J2000: 32;
    readonly SEFLG_NONUT: 64;
    readonly SEFLG_SPEED: 256;
    readonly SEFLG_NOGDEFL: 512;
    readonly SEFLG_NOABERR: 1024;
    readonly SEFLG_EQUATORIAL: 2048;
    readonly SEFLG_XYZ: 4096;
    readonly SEFLG_RADIANS: 8192;
    readonly SEFLG_BARYCTR: 16384;
    readonly SEFLG_TOPOCTR: 32768;
    readonly SEFLG_SIDEREAL: 65536;

    // Sidereal modes
    readonly SE_SIDM_FAGAN_BRADLEY: 0;
    readonly SE_SIDM_LAHIRI: 1;
    readonly SE_SIDM_DELUCE: 2;
    readonly SE_SIDM_RAMAN: 3;
    readonly SE_SIDM_KRISHNAMURTI: 5;
    readonly SE_SIDM_USER: 255;

    // Rise/set
    readonly SE_CALC_RISE: 1;
    readonly SE_CALC_SET: 2;
    readonly SE_CALC_MTRANSIT: 4;
    readonly SE_CALC_ITRANSIT: 8;

    // Eclipse
    readonly SE_ECL_TOTAL: 4;
    readonly SE_ECL_ANNULAR: 8;
    readonly SE_ECL_PARTIAL: 16;
    readonly SE_ECL_ANNULAR_TOTAL: 32;
    readonly SE_ECL_PENUMBRAL: 64;
    readonly SE_ECL_ALLTYPES_SOLAR: 63;
    readonly SE_ECL_ALLTYPES_LUNAR: 84;

    // Azalt
    readonly SE_ECL2HOR: 0;
    readonly SE_EQU2HOR: 1;

    // Degree split
    readonly SE_SPLIT_DEG_ROUND_SEC: 1;
    readonly SE_SPLIT_DEG_ROUND_MIN: 2;
    readonly SE_SPLIT_DEG_ROUND_DEG: 4;
    readonly SE_SPLIT_DEG_ZODIACAL: 8;
    readonly SE_SPLIT_DEG_KEEP_SIGN: 16;
    readonly SE_SPLIT_DEG_KEEP_DEG: 32;

    readonly TJD_INVALID: 99999999.0;

    initSwissEph(): Promise<void>;
    close(): void;

    julday(year: number, month: number, day: number, hour: number): number;
    revjul(jd: number, gregflag: number): { year: number; month: number; day: number; hour: number };
    date_conversion(year: number, month: number, day: number, hour: number, gregflag: string): number;

    calc_ut(jd: number, planet: number, flags: number): Float64Array;
    calc(jd: number, planet: number, flags: number): {
      longitude: number; latitude: number; distance: number;
      longitudeSpeed: number; latitudeSpeed: number; distanceSpeed: number;
    };

    deltat(jd: number): number;
    sidtime(jd: number): number;
    sidtime0(jd: number, eps: number, nut: number): number;

    utc_to_jd(year: number, month: number, day: number, hour: number, minute: number, second: number, gregflag: number): {
      julianDayET: number; julianDayUT: number;
    };
    jdet_to_utc(jd: number, gregflag: number): { year: number; month: number; day: number; hour: number; minute: number; second: number };
    jdut1_to_utc(jd: number, gregflag: number): { year: number; month: number; day: number; hour: number; minute: number; second: number };
    utc_time_zone(year: number, month: number, day: number, hour: number, minute: number, second: number, timezone: number): {
      year: number; month: number; day: number; hour: number; minute: number; second: number;
    };

    degnorm(degrees: number): number;
    radnorm(angle: number): number;
    split_deg(degrees: number, roundflag: number): { degree: number; min: number; second: number; fraction: number; sign: number };
    day_of_week(jd: number): number;

    set_sid_mode(sidmode: number, t0: number, ayan_t0: number): void;
    get_ayanamsa(jd: number): number;
    get_ayanamsa_ut(jd: number): number;
    get_ayanamsa_name(sidmode: number): string;

    version(): string;
    get_planet_name(planet: number): string;

    set_topo(longitude: number, latitude: number, altitude: number): void;
    set_ephe_path(path: string): void;

    fixstar(star: string, jd: number, flags: number): Float64Array | null;
    fixstar_ut(star: string, jd: number, flags: number): Float64Array | null;
    fixstar_mag(star: string): number | null;
    fixstar2(star: string, jd: number, flags: number): Float64Array | null;
    fixstar2_ut(star: string, jd: number, flags: number): Float64Array | null;
    fixstar2_mag(star: string): number | null;

    houses(jd: number, latitude: number, longitude: number, hsys: string): {
      cusps: Float64Array; ascmc: Float64Array;
    };
    houses_ex(jd: number, iflag: number, latitude: number, longitude: number, hsys: string): {
      cusps: Float64Array; ascmc: Float64Array;
    };
    house_pos(armc: number, geolat: number, eps: number, hsys: string, lon: number, lat: number): number;

    cotrans(xpo: number[], eps: number): number[];
    cotrans_sp(xpo: number[], eps: number): number[];

    azalt(tjd_ut: number, calc_flag: number, geopos: number[], atpress: number, attemp: number, xin: number[]): {
      azimuth: number; trueAltitude: number; apparentAltitude: number;
    };
    azalt_rev(tjd_ut: number, calc_flag: number, geopos: number[], xin: number[]): {
      ra: number; dec: number; distance: number;
    };

    rise_trans(jd: number, planet: number, longitude: number, latitude: number, altitude: number, flags: number): Float64Array | null;

    sol_eclipse_when_glob(jdStart: number, flags: number, eclipseType: number, backward: number): Float64Array | null;
    sol_eclipse_when_loc(jdStart: number, flags: number, longitude: number, latitude: number, altitude: number, backward: number): Float64Array | null;
    sol_eclipse_where(jd: number, flags: number): Float64Array | null;
    sol_eclipse_how(jd: number, flags: number, longitude: number, latitude: number, altitude: number): Float64Array | null;

    lun_eclipse_when(jdStart: number, flags: number, eclipseType: number, backward: number): Float64Array | null;
    lun_eclipse_when_loc(jdStart: number, flags: number, longitude: number, latitude: number, altitude: number, backward: number): Float64Array | null;
    lun_eclipse_how(jd: number, flags: number, longitude: number, latitude: number, altitude: number): Float64Array | null;

    pheno(jd: number, planet: number, flags: number): Float64Array | null;
    pheno_ut(jd: number, planet: number, flags: number): Float64Array | null;

    time_equ(jd: number): number;
    deg_midp(x1: number, x2: number): number;
    rad_midp(x1: number, x2: number): number;
  }
}
