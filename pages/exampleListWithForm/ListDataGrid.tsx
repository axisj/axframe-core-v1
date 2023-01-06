import * as React from "react";
import styled from "@emotion/styled";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import { DataGrid } from "@core/components/DataGrid";
import { useContainerSize } from "@core/hooks/useContainerSize";
import { AXFDGColumn, AXFDGProps } from "@axframe/datagrid";
import { useI18n } from "@core/hooks/useI18n";
import { useExampleListWithFormStore } from "./useExampleListWithFormStore";

interface Props {
  onClick: AXFDGProps<ExampleItem>["onClick"];
}

function ListDataGrid({ onClick }: Props) {
  const listColWidths = useExampleListWithFormStore((s) => s.listColWidths);
  const listSortParams = useExampleListWithFormStore((s) => s.listSortParams);
  const listData = useExampleListWithFormStore((s) => s.listData);
  const listPage = useExampleListWithFormStore((s) => s.listPage);
  const listSpinning = useExampleListWithFormStore((s) => s.listSpinning);
  const setListColWidths = useExampleListWithFormStore((s) => s.setListColWidths);
  const setListSortParams = useExampleListWithFormStore((s) => s.setListSortParams);
  const changeListPage = useExampleListWithFormStore((s) => s.changeListPage);
  const listSelectedRowKey = useExampleListWithFormStore((s) => s.listSelectedRowKey);

  const { t } = useI18n();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  const handleColumnsChange = React.useCallback(
    (columnIndex: number, width: number, columns: AXFDGColumn<ExampleItem>[]) => {
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
        ] as AXFDGColumn<ExampleItem>[]
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
      <DataGrid<ExampleItem>
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
