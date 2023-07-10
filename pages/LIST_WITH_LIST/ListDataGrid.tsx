import * as React from "react";
import styled from "@emotion/styled";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import { DataGrid } from "@core/components/DataGrid";
import { useContainerSize, useI18n } from "@core/hooks";
import { AXFDGColumn, AXFDGProps } from "@axframe/datagrid";
import { use$LIST_WITH_LIST$Store } from "./use$LIST_WITH_LIST$Store";
import { PageLayout } from "styles/pageStyled";

interface DtoItem extends ExampleItem {}
interface Props {
  onClick: AXFDGProps<DtoItem>["onClick"];
}

function ListDataGrid({ onClick }: Props) {
  const listColWidths = use$LIST_WITH_LIST$Store((s) => s.listColWidths);
  const listSortParams = use$LIST_WITH_LIST$Store((s) => s.listSortParams);
  const listData = use$LIST_WITH_LIST$Store((s) => s.listData);
  const listPage = use$LIST_WITH_LIST$Store((s) => s.listPage);
  const spinning = use$LIST_WITH_LIST$Store((s) => s.spinning);
  const setListColWidths = use$LIST_WITH_LIST$Store((s) => s.setListColWidths);
  const setListSortParams = use$LIST_WITH_LIST$Store((s) => s.setListSortParams);
  const changeListPage = use$LIST_WITH_LIST$Store((s) => s.changeListPage);
  const listSelectedRowKey = use$LIST_WITH_LIST$Store((s) => s.listSelectedRowKey);

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
          { key: "id", label: t.pages.example.datagrid.id, align: "left", width: 80 },
          { key: "name", label: t.pages.example.datagrid.성명, align: "left", width: 80 },
          { key: "cnsltDt", label: t.pages.example.datagrid.상담일, align: "left", width: 100 },
          { key: "area", label: t.pages.example.datagrid.행정구, align: "left", width: 80 },
          { key: "birthDt", label: t.pages.example.datagrid.생년월일, align: "center", width: 120 },
          { key: "phone1", label: t.pages.example.datagrid.연락처, align: "center", width: 150 },
          { key: "cnsltHow", label: t.pages.example.datagrid.상담방법, align: "left", width: 100 },
          { key: "cnsltPath", label: t.pages.example.datagrid.상담경로, align: "left", width: 150 },
          { key: "fmTyp", label: t.pages.example.datagrid.가구유형, align: "left", width: 100 },
          { key: "homeTyp", label: t.pages.example.datagrid.거주형태, align: "left", width: 100 },
          { key: "fldA", label: t.pages.example.datagrid.수급, align: "left", width: 100 },
          { key: "hopePoint", label: t.pages.example.datagrid.주요욕구, align: "left", width: 150 },
          { key: "updatedByNm", label: t.pages.example.datagrid.상담원, align: "left", width: 120 },
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
    <>
      <Header>
        <div>{t.pages.example.list.title}</div>
        <ButtonGroup compact></ButtonGroup>
      </Header>
      <Container ref={containerRef}>
        <DataGrid<DtoItem>
          frozenColumnIndex={0}
          width={containerWidth}
          height={containerHeight}
          columns={columns}
          data={listData}
          spinning={spinning}
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
    </>
  );
}

const Container = styled.div`
  flex: 1;
`;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;
const Header = styled(PageLayout.FrameHeader)``;

export { ListDataGrid };
