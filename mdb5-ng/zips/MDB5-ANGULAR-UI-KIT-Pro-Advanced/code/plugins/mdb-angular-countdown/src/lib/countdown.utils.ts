export function getNowDatePlusSeconds(numOfSeconds, date = new Date()) {
  date.setSeconds(date.getSeconds() + numOfSeconds);
  return date;
}

export function convertMsToDays(ms: number): string {
  if (ms <= 0) {
    return '00';
  }

  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  return days > 9 ? `${days}` : `0${days}`;
}

export function convertMsToHours(ms: number): string {
  if (ms <= 0) {
    return '00';
  }

  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return hours > 9 ? `${hours}` : `0${hours}`;
}

export function convertMsToMinutes(ms: number): string {
  if (ms <= 0) {
    return '00';
  }

  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return minutes > 9 ? `${minutes}` : `0${minutes}`;
}

export function convertMsToSeconds(ms: number): string {
  if (ms <= 0) {
    return '00';
  }

  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  return seconds > 9 ? `${seconds}` : `0${seconds}`;
}
