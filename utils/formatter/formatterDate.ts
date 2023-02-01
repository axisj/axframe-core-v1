import dayjs from "dayjs";

export function formatterDate(dateString: string) {
  return dayjs(dateString).format("YYYY-MM-DD");
}
