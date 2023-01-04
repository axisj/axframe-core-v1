import moment, { Moment } from "moment";

export function getMomentRangeValue(values?: any[]): Moment[] {
  if (values) {
    const [v1, v2] = values;
    const mv1 = v1 ? moment(v1) : undefined;
    const mv2 = v2 ? moment(v2) : undefined;
    if (mv1 && mv2) {
      return [mv1, mv2];
    }
    return [];
  }

  return [];
}
