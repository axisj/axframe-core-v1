import dayjs from "dayjs";

export function convertToDate(target: Record<string, any> = {}, keys?: string[]) {
  if (!target) return target;

  if (keys) {
    keys.forEach((key) => {
      if (target[key] && dayjs(target[key]).isValid()) {
        target[key] = dayjs(target[key]);
      }
    });
  } else {
    Object.keys(target).forEach((key) => {
      if (target[key] && dayjs(target[key]).isValid()) {
        target[key] = dayjs(target[key]);
      }
    });
  }

  return target;
}
