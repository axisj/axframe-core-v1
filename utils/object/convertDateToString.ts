import dayjs from "dayjs";
import { projectConfig } from "projectConfig";

export function convertDateToString(
  target: Record<string, any> = {},
  formatString: string = projectConfig.dateFormatString,
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
