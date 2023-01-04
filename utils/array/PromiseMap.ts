export async function PromiseMap<T, R>(
  arr: T[],
  callback: (value: T, index: number, arr: T[]) => PromiseLike<R>,
): Promise<R[]> {
  let index = 0;
  const result: R[] = [];

  for await (const value of arr)
    result.push(await callback(value, index++, arr));

  return result;
}
