import {
  formatDate,
  formatDateTime,
  getDayOfYear,
  getISOWeekParts,
  getISOWeekString,
  getMoonPhase,
  getNewYearCountdownString,
  getQuarterInfo,
  isLeapYear,
} from "./date-utils.mjs";
import { SOLSTICE_TABLE, SOLSTICE_TABLE_END_YEAR } from "./solstice-data.js";

const DEFAULT_TIMEZONE =
  Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
const DEFAULT_LOCALE = Intl.DateTimeFormat().resolvedOptions().locale || "en-US";

function getNextSolstice(today) {
  for (const s of SOLSTICE_TABLE) {
    if (s.date > today) {
      return s;
    }
  }
  return null;
}

function updateSolsticeInfo(now) {
  const solsticeInfo = document.getElementById("solsticeInfo");
  const next = getNextSolstice(now);

  if (!next) {
    solsticeInfo.textContent = `No solstice data beyond ${SOLSTICE_TABLE_END_YEAR}.`;
    return;
  }

  const diffDays = Math.floor((next.date - now) / 86400000);
  const dateLabel = next.date.toLocaleDateString(DEFAULT_LOCALE, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: DEFAULT_TIMEZONE,
  });
  const daysText = `${diffDays} day${diffDays !== 1 ? "s" : ""} left`;

  solsticeInfo.textContent = "";

  const label = document.createElement("span");
  label.className = "label";
  label.textContent = "Next solstice ☀️:";

  const value = document.createElement("span");
  value.className = "code";
  value.textContent = ` ${next.name} — ${dateLabel} (${daysText})`;

  solsticeInfo.appendChild(label);
  solsticeInfo.appendChild(document.createTextNode(" "));
  solsticeInfo.appendChild(value);
}

function updateUI(now) {
  const year = now.getFullYear();
  const totalDays = isLeapYear(year) ? 366 : 365;

  document.getElementById("currentYear").textContent = year;
  document.getElementById("currentDate").textContent = `${formatDate(now, {
    locale: DEFAULT_LOCALE,
    timeZone: DEFAULT_TIMEZONE,
  })} (${DEFAULT_TIMEZONE})`;

  const { weekNo } = getISOWeekParts(now);
  document.getElementById("weekNumber").textContent = weekNo;
  document.getElementById("isoWeek").textContent = getISOWeekString(now);

  const dayOfYear = getDayOfYear(now);
  document.getElementById("dayOfYear").textContent = dayOfYear;
  document.getElementById("totalDays").textContent = totalDays;

  document.getElementById("gmtTime").textContent =
    formatDateTime(now, {
      locale: "en-CA",
      timeZone: DEFAULT_TIMEZONE,
      hour12: false,
    }) + ` (${DEFAULT_TIMEZONE})`;
  document.getElementById("gmtTime").setAttribute("datetime", now.toISOString());

  document.getElementById("utcTime").textContent =
    formatDateTime(now, {
      locale: "en-CA",
      timeZone: "UTC",
      hour12: false,
    }) + " (UTC)";
  document.getElementById("utcTime").setAttribute("datetime", now.toISOString());

  document.getElementById("unixTime").textContent = Math.floor(now.getTime() / 1000);

  const progressPercent = ((dayOfYear / totalDays) * 100).toFixed(1);
  document.getElementById("yearProgress").textContent = `${progressPercent}%`;
  document.getElementById("progressFill").style.width = `${progressPercent}%`;

  document.getElementById("quarterMain").textContent = getQuarterInfo(now);
  document.getElementById("quarterYear").textContent = year;

  document.getElementById("moonPhaseText").textContent = getMoonPhase(now);
  document.getElementById("newYearCountdown").textContent = getNewYearCountdownString(now);
}

let clockIntervalId = null;

function tickClock() {
  const now = new Date();
  updateUI(now);
  updateSolsticeInfo(now);
}

function startClock() {
  if (clockIntervalId !== null) return;
  tickClock();
  clockIntervalId = setInterval(tickClock, 1000);
}

function stopClock() {
  if (clockIntervalId === null) return;
  clearInterval(clockIntervalId);
  clockIntervalId = null;
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopClock();
  } else {
    startClock();
  }
});

startClock();
