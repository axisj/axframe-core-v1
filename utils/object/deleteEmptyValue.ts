export function deleteEmptyValue(target: Record<string, any> = {}) {
  if (!target) return target;

  Object.keys(target).forEach((key) => {
    if (target[key] === "") {
      target[key] = undefined;
    }
  });

  return target;
}
