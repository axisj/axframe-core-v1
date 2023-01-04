import * as React from "react";
import { IParam, SearchParamOption } from "../components/search";
import { AXFDGColumn, AXFDGSortParam } from "@axframe/datagrid";

export function useListPageData<P, R, T>(initialSearchParams: P, pageMetadata: P) {
  const data = {
    ...initialSearchParams,
    ...pageMetadata,
  } as P;

  const [showSearchParamChildren, setShowSearchParamChildren] = React.useState(
    pageMetadata?.["showSearchParamChildren"] ?? false
  );
  const [searchFilterTypeOptions, setSearchFilterTypeOptions] = React.useState<SearchParamOption[]>([]);
  const [searchParamObjects, setSearchParamObjects] = React.useState<IParam[]>([]);
  const [searchParamValues, setSearchParamValues] = React.useState<P>(data);
  const [columns, setColumns] = React.useState<AXFDGColumn<T>[]>([]);
  const [colWidths, setColWidths] = React.useState<number[]>(data["colWidths"] ?? []);
  const [sortParams, setSortParams] = React.useState<AXFDGSortParam[]>(data["sorts"] ?? []);
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [apiResponse, setApiResponse] = React.useState<R>();

  return {
    showSearchParamChildren,
    setShowSearchParamChildren,
    searchFilterTypeOptions,
    setSearchFilterTypeOptions,
    searchParamObjects,
    setSearchParamObjects,
    searchParamValues,
    setSearchParamValues,
    columns,
    setColumns,
    colWidths,
    setColWidths,
    sortParams,
    setSortParams,
    selectedIds,
    setSelectedIds,
    apiResponse,
    setApiResponse,
  };
}
