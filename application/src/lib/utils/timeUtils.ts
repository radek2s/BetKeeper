export function toRelativeTime(date: Date) {
  const dateTime = date.getTime();
  const nowTime = Date.now();

  const diff = nowTime - dateTime;
  if (diff < 0)
    throw new Error("Invalid time! Can't calculate relative value to future");

  return getTimeUnit(diff);

  function getTimeUnit(value: number) {
    const seconds = Math.floor(value / 1000);
    const divide = (unit: number) => divideRound(seconds, unit);

    if (seconds < TimeUnits.SECONDS) return [seconds, "seconds"];
    if (seconds < TimeUnits.MINUTES)
      return [divide(TimeUnits.SECONDS), "minutes"];
    if (seconds < TimeUnits.HOURS) return [divide(TimeUnits.MINUTES), "hours"];
    if (seconds < TimeUnits.DAYS) return [divide(TimeUnits.HOURS), "days"];
    return [divide(TimeUnits.DAYS), "months"];
  }
}

function divideRound(value: number, unit: number) {
  return Math.floor(value / unit);
}

const TimeUnits = {
  SECONDS: 60,
  MINUTES: 3600,
  HOURS: 86400,
  DAYS: 2592000,
  MONTHS: 31104000,
};
// const UnitMap =
