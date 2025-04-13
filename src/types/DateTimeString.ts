enum DateTimeStringEnum {};

export type DateTimeString = string & DateTimeStringEnum;

export function isValidDateTimeString(str: string): str is DateTimeString {
  return str.match(/^\d{4}-\d{2}-\d{2}T(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/) !== null;
}
