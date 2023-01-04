import moment from "moment";

export function formatterDate(dateString: string) {
  return moment(dateString).format("YYYY-MM-DD");
}
