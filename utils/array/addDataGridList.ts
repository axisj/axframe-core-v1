import { AXFDGDataItem, AXFDGDataItemStatus } from "@axframe/datagrid";

export function addDataGridList<T>(listData: AXFDGDataItem<T>[], list: T[]): AXFDGDataItem<T>[] {
  listData.push(
    ...list.map((n) => ({
      status: AXFDGDataItemStatus.new,
      values: n,
    }))
  );

  return listData;
}
