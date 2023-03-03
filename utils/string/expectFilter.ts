export function expectFilter(string: string): string {
  const reservedUnix = /[<>:"\/\\|?*\x00-\x1F\[\]()^$+]/g;

  return string.replace(reservedUnix, '\\$&');
}
