// Offline date converters for Hijri and Bengali calendars

export function getBengaliDate(date) {
  // Approximate Bengali date converter
  // Bangla Calendar starts from April 14 (Poyela Boishakh)
  const month = date.getMonth(); // 0-11
  const day = date.getDate();
  
  const banglaMonths = [
    "পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র", "বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ", "ভাদ্র", "আশ্বিন", "কার্তিক", "অগ্রহায়ণ"
  ];
  
  // Calculate index offset
  // April 14 is Boishakh 1 (index 4)
  let bnDay = day;
  let bnMonthIdx = 0;
  
  // Very simplified approximate calculation for demo
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  if (month === 0) { // Jan
    bnMonthIdx = day < 15 ? 0 : 1; // Poush / Magh
    bnDay = day < 15 ? day + 16 : day - 14;
  } else if (month === 1) { // Feb
    bnMonthIdx = day < 14 ? 1 : 2; // Magh / Falgun
    bnDay = day < 14 ? day + 17 : day - 13;
  } else if (month === 2) { // Mar
    bnMonthIdx = day < 15 ? 2 : 3; // Falgun / Chaitra
    bnDay = day < 15 ? day + 14 : day - 14;
  } else if (month === 3) { // Apr
    bnMonthIdx = day < 14 ? 3 : 4; // Chaitra / Boishakh
    bnDay = day < 14 ? day + 17 : day - 13;
  } else if (month === 4) { // May
    bnMonthIdx = day < 15 ? 4 : 5; // Boishakh / Jaishtha
    bnDay = day < 15 ? day + 17 : day - 14;
  } else if (month === 5) { // Jun
    bnMonthIdx = day < 15 ? 5 : 6; // Jaishtha / Asharh
    bnDay = day < 15 ? day + 17 : day - 14;
  } else if (month === 6) { // Jul
    bnMonthIdx = day < 16 ? 6 : 7; // Asharh / Shrabon
    bnDay = day < 16 ? day + 15 : day - 15;
  } else if (month === 7) { // Aug
    bnMonthIdx = day < 16 ? 7 : 8; // Shrabon / Bhadra
    bnDay = day < 16 ? day + 16 : day - 15;
  } else if (month === 8) { // Sep
    bnMonthIdx = day < 16 ? 8 : 9; // Bhadra / Ashwin
    bnDay = day < 16 ? day + 15 : day - 15;
  } else if (month === 9) { // Oct
    bnMonthIdx = day < 16 ? 9 : 10; // Ashwin / Kartik
    bnDay = day < 16 ? day + 15 : day - 15;
  } else if (month === 10) { // Nov
    bnMonthIdx = day < 16 ? 10 : 11; // Kartik / Agrahayan
    bnDay = day < 16 ? day + 15 : day - 15;
  } else if (month === 11) { // Dec
    bnMonthIdx = day < 16 ? 11 : 0; // Agrahayan / Poush
    bnDay = day < 16 ? day + 15 : day - 15;
  }
  
  // Convert bnDay to Bengali digits
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  const bnDayStr = bnDay.toString().split('').map(digit => bnDigits[parseInt(digit)]).join('');
  
  return `${bnDayStr} ${banglaMonths[bnMonthIdx]}`;
}

export function getHijriDate(date) {
  // Approximate Hijri date converter using tabular Islamic calendar formula
  let jd = 0;
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();
  
  if (m < 3) {
    y -= 1;
    m += 12;
  }
  
  let a = Math.floor(y / 100);
  let b = Math.floor(a / 4);
  let c = 2 - a + b;
  let e = Math.floor(365.25 * (y + 4716));
  let f = Math.floor(30.6001 * (m + 1));
  jd = c + d + e + f - 1524.5;
  
  const epoch = 1948439.5;
  const cycle = 10631;
  const cycleYears = 30;
  
  let diff = jd - epoch;
  let cycleCount = Math.floor(diff / cycle);
  let yearInCycle = 0;
  
  diff = diff % cycle;
  if (diff < 0) {
    diff += cycle;
    cycleCount -= 1;
  }
  
  const leapYears = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];
  let days = 0;
  for (let i = 1; i <= cycleYears; i++) {
    const isLeap = leapYears.includes(i);
    const yearDays = isLeap ? 355 : 354;
    if (days + yearDays > diff) {
      yearInCycle = i;
      break;
    }
    days += yearDays;
  }
  
  const hijriYear = cycleCount * cycleYears + yearInCycle;
  let daysInYear = diff - days;
  
  const hijriMonths = [
    "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani", "Jumada al-Awwal", "Jumada al-Thani",
    "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhu al-Qa'dah", "Dhu al-Hijjah"
  ];
  
  let hijriMonthIdx = 0;
  let monthDays = 30;
  let accumulatedDays = 0;
  
  for (let i = 0; i < 12; i++) {
    // Odd months have 30 days, even have 29. 12th month has 30 in leap year.
    const isLeapYear = leapYears.includes(yearInCycle);
    monthDays = (i % 2 === 0) ? 30 : 29;
    if (i === 11 && isLeapYear) monthDays = 30;
    
    if (accumulatedDays + monthDays > daysInYear) {
      hijriMonthIdx = i;
      break;
    }
    accumulatedDays += monthDays;
  }
  
  const hijriDay = Math.floor(daysInYear - accumulatedDays) + 1;
  
  // Weekday mapping
  const weekdays = ["Yaumul Ahad", "Yaumul Ithnayn", "Yaumul Thulatha", "Yaumul Arba'a", "Yaumul Khamis", "Yaumul Jumu'ah", "Yaumul Sabt"];
  const hijriWeekday = weekdays[date.getDay()];
  
  return `${hijriDay} ${hijriMonths[hijriMonthIdx]} ${hijriYear} H. ${hijriWeekday}`;
}
