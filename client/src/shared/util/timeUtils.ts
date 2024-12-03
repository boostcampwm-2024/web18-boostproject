export type TimeZoneOffset = {
  readonly KST: 9;
};

export const TIMEZONE_OFFSET: TimeZoneOffset = {
  KST: 9,
} as const;

/**
 * 한국 시간으로 변환
 * @param dateString
 * @returns
 */
export function convertToKTC(dateString: string) {
  const date = new Date(dateString);
  date.setHours(date.getHours() + TIMEZONE_OFFSET.KST);
  return date.toISOString();
}
/**
 * 월/일 시간 문자열 반환
 * @param dateString
 * @returns
 */
export function splitDate(dateString: string) {
  const [date, time] = dateString.split('T');
  const [_, month, day] = date.split('-');
  return `${month}월 ${day}일 ${time.slice(0, 5)}`;
}
/**
 * 시/분/초 문자열 반환
 * @param time
 * @returns
 */
export function splitTime(time: string) {
  const hour = Math.floor(Number(time) / 3600);
  const minute = Math.floor((Number(time) % 3600) / 60);
  const second = Math.floor(Number(time) % 60);

  return (
    (hour > 0 ? String(hour).padStart(2, '0') + ':' : '') +
    String(minute).padStart(2, '0') +
    ':' +
    String(second).padStart(2, '0')
  );
}

/**
 * 초를 더한 시간 반환
 * @param dateString
 * @param seconds
 * @returns
 */
export function sumSeconds(dateString: string, seconds: number) {
  const date = new Date(dateString);
  date.setTime(date.getTime() + seconds * 1000);
  return date;
}

/**
 * 시간 비교 0보다 크면 date1이 더 큼
 * @param date1
 * @param date2
 * @returns
 */
export function compareDate(date1: Date, date2: Date) {
  return date1.getTime() - date2.getTime();
}
