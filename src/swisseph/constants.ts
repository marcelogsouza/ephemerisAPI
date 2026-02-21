export const PLANETS: Record<string, number> = {
  sun: 0,
  moon: 1,
  mercury: 2,
  venus: 3,
  mars: 4,
  jupiter: 5,
  saturn: 6,
  uranus: 7,
  neptune: 8,
  pluto: 9,
  mean_node: 10,
  true_node: 11,
  mean_apogee: 12,
  oscu_apogee: 13,
  earth: 14,
  chiron: 15,
  pholus: 16,
  ceres: 17,
  pallas: 18,
  juno: 19,
  vesta: 20,
};

export const PLANET_ALIASES: Record<string, string> = {
  lilith: 'mean_apogee',
  true_lilith: 'oscu_apogee',
  quiron: 'chiron',
};

export const POINT_ALIASES: Record<string, string> = {
  fortuna: 'fortuna',
  fortune: 'fortuna',
  part_of_fortune: 'fortuna',
  pars_fortuna: 'fortuna',
};

export const POINT_KEYS = new Set(Object.values(POINT_ALIASES));

export function normalizeBodyKey(key: string): string {
  const normalized = key.trim().toLowerCase();
  if (POINT_ALIASES[normalized]) return POINT_ALIASES[normalized];
  if (PLANET_ALIASES[normalized]) return PLANET_ALIASES[normalized];
  return normalized;
}

export const PLANET_NAMES: Record<number, string> = Object.fromEntries(
  Object.entries(PLANETS).map(([name, id]) => [id, name])
);

export const HOUSE_SYSTEMS: Record<string, string> = {
  P: 'Placidus',
  K: 'Koch',
  O: 'Porphyrius',
  R: 'Regiomontanus',
  C: 'Campanus',
  E: 'Equal',
  W: 'Whole Sign',
  B: 'Alcabitius',
  M: 'Morinus',
  T: 'Polich/Page (Topocentric)',
};

export const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
] as const;

export const ASPECTS: Record<string, number> = {
  conjunction: 0,
  opposition: 180,
  trine: 120,
  square: 90,
  sextile: 60,
  quincunx: 150,
  semisextile: 30,
  semisquare: 45,
  sesquisquare: 135,
  quintile: 72,
  biquintile: 144,
};

export const DEFAULT_ORBS: Record<string, number> = {
  conjunction: 10,
  opposition: 10,
  trine: 8,
  square: 8,
  sextile: 6,
  quincunx: 3,
  semisextile: 2,
  semisquare: 2,
  sesquisquare: 2,
  quintile: 2,
  biquintile: 2,
};

export const SIDEREAL_MODES: Record<string, number> = {
  fagan_bradley: 0,
  lahiri: 1,
  deluce: 2,
  raman: 3,
  ushashashi: 4,
  krishnamurti: 5,
  djwhal_khul: 6,
  yukteshwar: 7,
  jn_bhasin: 8,
  babyl_kugler1: 9,
  babyl_kugler2: 10,
  babyl_kugler3: 11,
  babyl_huber: 12,
  babyl_etpsc: 13,
  aldebaran_15tau: 14,
  hipparchos: 15,
  sassanian: 16,
  galcent_0sag: 17,
  j2000: 18,
  j1900: 19,
  b1950: 20,
  suryasiddhanta: 21,
  suryasiddhanta_msun: 22,
  aryabhata: 23,
  aryabhata_msun: 24,
  ss_revati: 25,
  ss_citra: 26,
  true_citra: 27,
  true_revati: 28,
  true_pushya: 29,
};

export const FLAGS = {
  SWIEPH: 2,
  SPEED: 256,
  SIDEREAL: 65536,
  EQUATORIAL: 2048,
  TOPOCTR: 32768,
  HELCTR: 8,
  BARYCTR: 16384,
  TRUEPOS: 16,
  J2000: 32,
  NONUT: 64,
  NOGDEFL: 512,
  NOABERR: 1024,
  RADIANS: 8192,
  XYZ: 4096,
} as const;

export function getZodiacSign(longitude: number): { sign: string; degree: number } {
  const normalized = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const degree = normalized % 30;
  return { sign: ZODIAC_SIGNS[signIndex], degree };
}
