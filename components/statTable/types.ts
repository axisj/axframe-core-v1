import * as React from "react";

type Align = "left" | "center" | "right";

export interface StatCol {
  width?: number;
}

export interface StatHeadTd {
  colspan?: number;
  rowspan?: number;
  label: string;
}

export interface StatHeadTr {
  children?: StatHeadTd[];
  align?: Align;
}

export interface StatBodyTd<T> {
  key: string;
  colspan?: number;
  rowspan?: number;
  isRowMerge?: (prevItem: T, curItem: T) => boolean;
  itemRender?: (item: T) => React.ReactNode;
  align?: Align;
}

export interface StatTotalTd {
  key?: string;
  label?: React.ReactNode;
  colspan?: number;
  totalType?: "sum" | "count" | "avg";
  itemRender?: (total: { sum: number; count: number }) => React.ReactNode;
  align?: Align;
}

export interface StatSubTotal<T> {
  condition: (curItem: T, nextItem: T) => boolean;
  columns: StatTotalTd[];
}

export interface StatTotal {
  columns: StatTotalTd[];
}

export interface StatTableStyleProps {
  headRowHeight?: number;
  bodyRowHeight?: number;
}
export interface StatTableProps<T> extends StatTableStyleProps {
  style?: React.CSSProperties;
  className?: string;
  colGroups: StatCol[];
  headColumns: StatHeadTr[];
  bodyColumns: StatBodyTd<T>[];
  subtotal?: StatSubTotal<T>;
  total?: StatTotal;
  data: T[];
}
