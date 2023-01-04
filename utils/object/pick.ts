export function pick<T extends object, K extends keyof T>(model: T, keys: K[]): Pick<T, K> {
  return keys.reduce<Pick<T, K>>(
    (acc, cur) => ({
      ...acc,
      [cur]: model[cur],
    }),
    {} as Pick<T, K>
  );
}
