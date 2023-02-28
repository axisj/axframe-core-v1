import * as React from "react";

type Align = "left" | "center" | "right";

export interface StatCol {
  width?: number;
}

export interface StatHeadTd {
  colspan?: number;
  rowspan?: number;
  label: string;
  align?: Align;
}

export interface StatHeadTr {
  children?: StatHeadTd[];
}

export interface StatBodyTd<T> {
  key: string;
  colspan?: number;
  rowspan?: number;
  isRowMerge?: (prevItem: T, curItem: T) => boolean;
  itemRender?: (item: T) => React.ReactNode;
  align?: Align;
}

export interface ItemTotal {
  sum: number;
  count: number;
}

export interface StatTotalTd<T> {
  key?: string;
  label?: React.ReactNode;
  colspan?: number;
  totalType?: "sum" | "count" | "avg";
  itemRender?: (total: ItemTotal, item: Record<keyof T, ItemTotal>) => React.ReactNode;
  align?: Align;
}

export interface StatSubTotal<T> {
  condition: (curItem: T, nextItem: T) => boolean;
  columns: StatTotalTd<T>[];
}

export interface StatTotal<T> {
  columns: StatTotalTd<T>[];
}

export interface StatTableStyleProps {
  headRowHeight?: number;
  bodyRowHeight?: number;
}
export interface StatTableProps<T> extends StatTableStyleProps {
  spinning?: boolean;
  style?: React.CSSProperties;
  className?: string;
  colGroups: StatCol[];
  headColumns: StatHeadTr[];
  bodyColumns: StatBodyTd<T>[];
  subtotal?: StatSubTotal<T>;
  total?: StatTotal<T>;
  data: T[];
}
