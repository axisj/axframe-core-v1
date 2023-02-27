import * as React from "react";

interface StatTd {
  colspan?: number;
  rowspan?: number;
  value?: React.ReactNode;
}

type StatValueFn = "sum" | "avg" | "count";

interface StatColumn {
  key: string | string[];
  rowMerge?: boolean;
  valueFn?: StatValueFn;
}

interface Props<T> {
  columns: StatColumn[];
  list: T[];
}

export function mergedList<T>({ columns, list }: Props<T>) {
  const rlist: StatTd[][] = [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
  }

  return [];
}
