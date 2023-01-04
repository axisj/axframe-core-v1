export function mergeProps<B, T extends Record<string, any>>(componentProps: B, controllerProps: T) {
  const props: Record<string, any> = {};
  Object.entries(controllerProps).forEach(([k, v]) => {
    props[k] = typeof componentProps[k] === "undefined" ? v : componentProps[k];
  });
  return props as T & B;
}
