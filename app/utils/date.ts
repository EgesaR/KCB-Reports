import { Jsonify } from "~/types/blog";

export function parseDates<T>(data: T): T {
  return JSON.parse(JSON.stringify(data), (key, value) => {
    if (typeof value === "string" && isIsoDateString(value)) {
      return new Date(value);
    }
    return value;
  });
}

function isIsoDateString(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);
}

export function stringifyDates<T>(data: T): Jsonify<T> {
  return JSON.parse(JSON.stringify(data));
}
