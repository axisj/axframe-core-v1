export async function PromiseEach<T, R>(
  arr: T[],
  callback: (value: T, index: number, arr: T[]) => Promise<R>,
): Promise<void> {
  let index = 0;
  for await (const value of arr) await callback(value, index++, arr);
}
