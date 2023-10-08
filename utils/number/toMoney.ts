import { toNumber } from "./";

export function toMoney(value: unknown, emptyString = "-"): string {
  if (value === undefined || value === null) return emptyString;

  const n = toNumber(value);
  let fractionDigit = 0;

  if (Number.isNaN(n)) {
    return String(value);
  } else if (!Number.isInteger(n)) {
    fractionDigit = 2;
  }

  return n
    .toFixed(fractionDigit)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
