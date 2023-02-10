import * as React from "react";
import styled from "@emotion/styled";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import { DataGrid } from "@core/components/DataGrid";
import { useContainerSize, useI18n } from "@core/hooks";
import { AXFDGColumn, AXFDGProps } from "@axframe/datagrid";
import { use$THREE_LIST$Store } from "./use$THREE_LIST$Store";

interface DtoItem extends ExampleItem {}
interface Props {
  onClick?: AXFDGProps<DtoItem>["onClick"];
}

function ListDataGrid({ onClick }: Props) {
  const listColWidths = use$THREE_LIST$Store((s) => s.listColWidths);
  const listSortParams = use$THREE_LIST$Store((s) => s.listSortParams);
  const listData = use$THREE_LIST$Store((s) => s.listData);
  const listPage = use$THREE_LIST$Store((s) => s.listPage);
  const listSpinning = use$THREE_LIST$Store((s) => s.listSpinning);
  const setListColWidths = use$THREE_LIST$Store((s) => s.setListColWidths);
  const setListSortParams = use$THREE_LIST$Store((s) => s.setListSortParams);
  const changeListPage = use$THREE_LIST$Store((s) => s.changeListPage);
  const listSelectedRowKey = use$THREE_LIST$Store((s) => s.listSelectedRowKey);

  const { t } = useI18n();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  const handleColumnsChange = React.useCallback(
    (columnIndex: number, width: number, columns: AXFDGColumn<DtoItem>[]) => {
      setListColWidths(columns.map((column) => column.width));
    },
    [setListColWidths]
  );

  const columns = React.useMemo(
    () =>
      (
        [
          { key: "id", label: t.datagrid.id, align: "left", width: 80 },
          { key: "name", label: t.datagrid.성명, align: "left", width: 80 },
          { key: "cnsltDt", label: t.datagrid.상담일, align: "left", width: 100 },
          { key: "area", label: t.datagrid.행정구, align: "left", width: 80 },
          { key: "birthDt", label: t.datagrid.생년월일, align: "center", width: 120 },
          { key: "phone1", label: t.datagrid.연락처, align: "center", width: 150 },
          { key: "cnsltHow", label: t.datagrid.상담방법, align: "left", width: 100 },
          { key: "cnsltPath", label: t.datagrid.상담경로, align: "left", width: 150 },
          { key: "fmTyp", label: t.datagrid.가구유형, align: "left", width: 100 },
          { key: "homeTyp", label: t.datagrid.거주형태, align: "left", width: 100 },
          { key: "fldA", label: t.datagrid.수급, align: "left", width: 100 },
          { key: "hopePoint", label: t.datagrid.주요욕구, align: "left", width: 150 },
          { key: "updatedByNm", label: t.datagrid.상담원, align: "left", width: 120 },
        ] as AXFDGColumn<DtoItem>[]
      ).map((column, colIndex) => {
        if (listColWidths.length > 0) {
          column.width = listColWidths[colIndex];
          return column;
        }

        return column;
      }),
    [t, listColWidths]
  );

  return (
    <Container ref={containerRef}>
      <DataGrid<DtoItem>
        frozenColumnIndex={0}
        width={containerWidth}
        height={containerHeight}
        columns={columns}
        data={listData}
        spinning={listSpinning}
        onClick={onClick}
        page={{
          ...listPage,
          loading: false,
          onChange: async (currentPage, pageSize) => {
            await changeListPage(currentPage, pageSize);
          },
        }}
        sort={{
          sortParams: listSortParams,
          onChange: setListSortParams,
        }}
        onChangeColumns={handleColumnsChange}
        rowKey={"id"}
        selectedRowKey={listSelectedRowKey ?? ""}
      />
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
`;

export { ListDataGrid };