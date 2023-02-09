import dayjs from "dayjs";

export function convertDateToString(
  target: Record<string, any> = {},
  formatString: string = "YYYY-MM-DDTHH:mm:ssZ[Z]",
  keys?: string[]
) {
  if (!target) return target;

  if (keys) {
    keys.forEach((key) => {
      if (target[key] instanceof dayjs) {
        target[key] = target[key].format(formatString);
      }
    });
  } else {
    Object.keys(target).forEach((key) => {
      if (target[key] instanceof dayjs) {
        target[key] = target[key].format(formatString);
      }
    });
  }

  return target;
}
