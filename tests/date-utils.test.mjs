import test from "node:test";
import assert from "node:assert/strict";

import {
  getDayOfYear,
  getISOWeekString,
  isLeapYear,
  getNewYearCountdownString,
} from "../public/date-utils.mjs";

test("ISO week boundaries across years", () => {
  assert.equal(getISOWeekString(new Date("2021-01-01T12:00:00Z")), "2020-W53");
  assert.equal(getISOWeekString(new Date("2026-01-01T12:00:00Z")), "2026-W01");
  assert.equal(getISOWeekString(new Date("2026-12-31T12:00:00Z")), "2026-W53");
});

test("Leap year detection is correct", () => {
  assert.equal(isLeapYear(2024), true);
  assert.equal(isLeapYear(2025), false);
  assert.equal(isLeapYear(1900), false);
  assert.equal(isLeapYear(2000), true);
});

test("Day of year remains monotonic across DST transitions", () => {
  const mar8 = new Date("2026-03-08T00:00:00");
  const mar9 = new Date("2026-03-09T00:00:00");
  const mar10 = new Date("2026-03-10T00:00:00");

  assert.equal(getDayOfYear(mar8), 67);
  assert.equal(getDayOfYear(mar9), 68);
  assert.equal(getDayOfYear(mar10), 69);

  const nov1 = new Date("2026-11-01T00:00:00");
  const nov2 = new Date("2026-11-02T00:00:00");

  assert.equal(getDayOfYear(nov1), 305);
  assert.equal(getDayOfYear(nov2), 306);
});

test("New year countdown uses local midnight", () => {
  const now = new Date("2026-12-31T20:00:00-05:00");
  assert.equal(getNewYearCountdownString(now), "0d 4h 0m 0s until 2027");
});
