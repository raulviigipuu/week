export function getISOWeekParts(date) {
  const temp = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = temp.getUTCDay() || 7;
  temp.setUTCDate(temp.getUTCDate() + 4 - dayNum);
  const isoYear = temp.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoYear, 0, 1));
  const weekNo = Math.ceil(((temp - yearStart) / 86400000 + 1) / 7);
  return { isoYear, weekNo };
}

export function getISOWeekString(date) {
  const { isoYear, weekNo } = getISOWeekParts(date);
  return `${isoYear}-W${String(weekNo).padStart(2, "0")}`;
}

export function getDayOfYear(date) {
  const utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const utcYearStart = Date.UTC(date.getFullYear(), 0, 0);
  return Math.floor((utcDate - utcYearStart) / 86400000);
}

export function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function formatDate(date, { locale, timeZone }) {
  return date.toLocaleDateString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone,
  });
}

export function formatDateTime(date, { locale, timeZone, hour12 = false }) {
  const parts = new Intl.DateTimeFormat(locale, {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12,
  }).formatToParts(date);

  const map = {};
  for (const part of parts) {
    if (part.type !== "literal") map[part.type] = part.value;
  }

  const period = map.dayPeriod ? ` ${map.dayPeriod}` : "";
  return `${map.year}.${map.month}.${map.day} ${map.hour}:${map.minute}:${map.second}${period}`;
}

export function getQuarterInfo(date) {
  const quarter = Math.floor(date.getMonth() / 3) + 1;
  return `Q${quarter}`;
}

export function getNewYearCountdownString(now) {
  const nextYear = now.getFullYear() + 1;
  const newYear = new Date(nextYear, 0, 1, 0, 0, 0, 0);
  const diffMs = newYear - now;
  if (diffMs <= 0) return "Happy New Year!";

  const totalSec = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSec / (3600 * 24));
  const hours = Math.floor((totalSec % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  return `${days}d ${hours}h ${minutes}m ${seconds}s until ${nextYear}`;
}

export function getMoonPhase(date) {
  const lunarCycle = 29.530588853;
  const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14));
  const diff = date - knownNewMoon;
  const days = diff / 86400000;
  const phase = ((days % lunarCycle) + lunarCycle) % lunarCycle;
  const percent = Math.round((phase / lunarCycle) * 100);

  let name = "";
  let emoji = "";

  if (phase < 1) {
    name = "New Moon";
    emoji = "🌑";
  } else if (phase < 7.4) {
    name = "Waxing Crescent";
    emoji = "🌒";
  } else if (phase < 8.4) {
    name = "First Quarter";
    emoji = "🌓";
  } else if (phase < 14.8) {
    name = "Waxing Gibbous";
    emoji = "🌔";
  } else if (phase < 15.8) {
    name = "Full Moon";
    emoji = "🌕";
  } else if (phase < 22.1) {
    name = "Waning Gibbous";
    emoji = "🌖";
  } else if (phase < 23.1) {
    name = "Last Quarter";
    emoji = "🌗";
  } else {
    name = "Waning Crescent";
    emoji = "🌘";
  }

  return `${emoji} ${name} (${percent}%)`;
}
