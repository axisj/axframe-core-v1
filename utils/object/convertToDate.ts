import moment from "moment";

export function convertToDate(target: Record<string, any> = {}, keys: string[]) {
  if (!target) return target;

  keys.forEach((key) => {
    if (moment(target[key], moment.ISO_8601, true).isValid()) {
      target[key] = moment(target[key]);
    }
  });
  return target;
}
