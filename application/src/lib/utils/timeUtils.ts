export function toRelativeTime(date: Date) {
  const dateTime = date.getTime();
  const nowTime = Date.now();

  const diff = nowTime - dateTime;
  if (diff < 0) return [0, "seconds"];

  return getTimeUnit(diff);

  function getTimeUnit(value: number) {
    const seconds = Math.floor(value / 1000);
    const divide = (unit: number) => divideRound(seconds, unit);

    if (seconds < TimeUnits.SECONDS) return [seconds, "second(s)"];
    if (seconds < TimeUnits.MINUTES)
      return [divide(TimeUnits.SECONDS), "minute(s)"];
    if (seconds < TimeUnits.HOURS)
      return [divide(TimeUnits.MINUTES), "hour(s)"];
    if (seconds < TimeUnits.DAYS) return [divide(TimeUnits.HOURS), "day(s)"];
    return [divide(TimeUnits.DAYS), "month(s)"];
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
