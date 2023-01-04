export function last<T>(
  array: Array<T>,
): T extends { length: 0 } ? undefined : T {
  return array[array.length - 1] as T extends { length: 0 } ? undefined : T;
}
