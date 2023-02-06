import dayjs from "dayjs";

export function convertToDate(target: Record<string, any> = {}, keys: string[]) {
  if (!target) return target;

  keys.forEach((key) => {
    if (target[key] && dayjs(dayjs(target[key]).toISOString()).isValid()) {
      target[key] = dayjs(target[key]);
    }
  });
  return target;
}
