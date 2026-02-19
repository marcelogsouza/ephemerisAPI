import { getSwissEph } from '../swisseph/singleton.js';

export async function getJulianDay(year: number, month: number, day: number, hour: number) {
  const swe = await getSwissEph();
  const jd = swe.julday(year, month, day, hour);
  return { julianDay: jd };
}

export async function getCalendarDate(julianDay: number, calendar: 'gregorian' | 'julian' = 'gregorian') {
  const swe = await getSwissEph();
  const gregflag = calendar === 'gregorian' ? swe.SE_GREG_CAL : swe.SE_JUL_CAL;
  return swe.revjul(julianDay, gregflag);
}

export async function getSiderealTime(julianDay: number) {
  const swe = await getSwissEph();
  const sidtime = swe.sidtime(julianDay);
  return { siderealTime: sidtime };
}

export async function getDeltaT(julianDay: number) {
  const swe = await getSwissEph();
  const deltaT = swe.deltat(julianDay);
  return { deltaT };
}

export async function utcToJd(
  year: number, month: number, day: number,
  hour: number, minute: number, second: number,
) {
  const swe = await getSwissEph();
  return swe.utc_to_jd(year, month, day, hour, minute, second, swe.SE_GREG_CAL);
}

export async function getDayOfWeek(year: number, month: number, day: number, hour: number) {
  const swe = await getSwissEph();
  const jd = swe.julday(year, month, day, hour);
  const dow = swe.day_of_week(jd);
  const names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return { dayOfWeek: dow, name: names[dow] };
}
