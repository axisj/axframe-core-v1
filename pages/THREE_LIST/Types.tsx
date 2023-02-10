import * as React from "react";
import { AXFDGDataItemStatus } from "@axframe/datagrid";
import { Tag } from "antd";

export const ITEM_STAT = {
  [AXFDGDataItemStatus.new]: <Tag color='processing'>C</Tag>,
  [AXFDGDataItemStatus.edit]: <Tag color='warning'>U</Tag>,
  [AXFDGDataItemStatus.remove]: <Tag color='error'>D</Tag>,
};
