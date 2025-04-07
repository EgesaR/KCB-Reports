export function parseJsonDates<T>(json: string): T {
  return JSON.parse(json, (key, value) => {
    if (typeof value === "string" && isIsoDateString(value)) {
      return new Date(value);
    }
    return value;
  });
}

function isIsoDateString(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);
}

export function stringifyWithDates<T>(value: T): string {
  return JSON.stringify(value);
}
