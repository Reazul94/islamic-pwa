import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from 'adhan';

export function getPrayerTimesForDate(date, latitude, longitude, madhhab) {
  const coords = new Coordinates(latitude, longitude);
  let params;
  
  if (madhhab === 'jafari') {
    params = CalculationMethod.Tehran(); // Shia Jafari standard method
  } else {
    params = CalculationMethod.Karachi(); // Sunni standard method
  }
  
  if (madhhab === 'hanafi') {
    params.madhab = Madhab.Hanafi;
  } else {
    params.madhab = Madhab.Shafi;
  }
  
  const prayerTimes = new PrayerTimes(coords, date, params);
  
  return {
    fajr: prayerTimes.fajr,
    sunrise: prayerTimes.sunrise,
    dhuhr: prayerTimes.dhuhr,
    asr: prayerTimes.asr,
    maghrib: prayerTimes.maghrib,
    isha: prayerTimes.isha,
    currentPrayer: prayerTimes.currentPrayer(),
    nextPrayer: prayerTimes.nextPrayer()
  };
}
