import * as React from "react";
import styled from "@emotion/styled";
import { ExampleItem, ExampleSubItem } from "@core/services/example/ExampleRepositoryInterface";
import { DataGrid } from "@core/components/DataGrid";
import { useContainerSize, useI18n } from "@core/hooks";
import { AXFDGColumn, AXFDGProps } from "@axframe/datagrid";
import { use$THREE_LIST$Store } from "./use$THREE_LIST$Store";

interface DtoItem extends ExampleItem {}

interface Props {
  onClick: AXFDGProps<DtoItem>["onClick"];
}

function SubListDataGrid({ onClick }: Props) {
  const listColWidths = use$THREE_LIST$Store((s) => s.subListColWidths);
  const listSortParams = use$THREE_LIST$Store((s) => s.subListSortParams);
  const listData = use$THREE_LIST$Store((s) => s.subListData);
  const listPage = use$THREE_LIST$Store((s) => s.subListPage);
  const listSpinning = use$THREE_LIST$Store((s) => s.subListSpinning);
  const setListColWidths = use$THREE_LIST$Store((s) => s.setSubListColWidths);
  const setListSortParams = use$THREE_LIST$Store((s) => s.setSubListSortParams);
  const changeListPage = use$THREE_LIST$Store((s) => s.changeSubListPage);

  const { t } = useI18n();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  const handleColumnsChange = React.useCallback(
    (columnIndex: number, width: number, columns: AXFDGColumn<ExampleSubItem>[]) => {
      setListColWidths(columns.map((column) => column.width));
    },
    [setListColWidths]
  );

  const columns = React.useMemo(
    () =>
      (
        [
          { key: "pid", label: "PID", align: "left", width: 80 },
          { key: "id", label: t.datagrid.id, align: "left", width: 80 },
          { key: "name", label: t.datagrid.성명, align: "left", width: 80 },
          { key: "type", label: "Type", align: "left", width: 100 },
        ] as AXFDGColumn<ExampleSubItem>[]
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
      <DataGrid<ExampleSubItem>
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
      />
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
`;

export { SubListDataGrid };
