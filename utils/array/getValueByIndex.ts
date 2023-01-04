export function getValueByIndex<T, F = undefined>(arr: T[], index: number, fallback?: F): T | F {
  return arr.length > 0 ? (arr[index] as T) : (fallback as F);
}
