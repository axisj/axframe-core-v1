export function deleteEmptyValue(target: Record<string, any> = {}) {
  if (!target) return target;

  Object.keys(target).forEach((key) => {
    if (target[key] === "") {
      delete target[key];
    }
  });

  return target;
}
