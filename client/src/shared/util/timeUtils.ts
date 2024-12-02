export type TimeZoneOffset = {
  readonly KST: 9;
};

export const TIMEZONE_OFFSET: TimeZoneOffset = {
  KST: 9,
} as const;

export function convertToKTC(dateString: string) {
  const date = new Date(dateString);
  date.setHours(date.getHours() + TIMEZONE_OFFSET.KST);
  return date.toISOString();
}

export function splitDate(date: string) {
  const [dateString, timeString] = date.split('T');
  const [_, month, day] = dateString.split('-');
  return `${month}월 ${day}일 ${timeString.slice(0, 5)}`;
}
