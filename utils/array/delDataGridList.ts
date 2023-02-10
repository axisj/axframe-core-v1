import { AXFDGDataItem, AXFDGDataItemStatus } from "@axframe/datagrid";

export function delDataGridList<T>(listData: AXFDGDataItem<T>[], indexes: number[]): AXFDGDataItem<T>[] {
  return listData
    .map((item, index) => {
      if (indexes.includes(index)) {
        if (item.status === AXFDGDataItemStatus.new) {
          return false;
        }
        return {
          ...item,
          status: AXFDGDataItemStatus.remove,
        };
      }

      return item;
    })
    .filter(Boolean) as AXFDGDataItem<T>[];
}
