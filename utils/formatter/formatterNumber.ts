export function formatterNumber(num: string | number = 0): string {
  return String(num).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
