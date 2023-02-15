import dayjs, { Dayjs } from "dayjs";

export function getDayJsRangeValue(values?: any[]): Dayjs[] {
  if (values) {
    const [v1, v2] = values;
    const mv1 = v1 ? dayjs(v1) : undefined;
    const mv2 = v2 ? dayjs(v2) : undefined;
    if (mv1 && mv2) {
      return [mv1, mv2];
    }
    return [];
  }

  return [];
}
