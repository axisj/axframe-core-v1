import * as React from "react";
import styled from "@emotion/styled";
import { ExampleSubItem } from "@core/services/example/ExampleRepositoryInterface";
import { DataGrid } from "@core/components/DataGrid";
import { useContainerSize, useI18n } from "@core/hooks";
import { AXFDGColumn, AXFDGProps } from "@axframe/datagrid";
import { use$THREE_LIST$Store } from "./use$THREE_LIST$Store";
import { Button } from "antd";
import { PageLayout } from "styles/pageStyled";
import { getSelectEditor, InputEditor } from "components/dataGridEditor";
import { ITEM_STAT } from "./Types";

interface DtoItem extends ExampleSubItem {}
interface Props {
  onClick?: AXFDGProps<DtoItem>["onClick"];
}

function ListDataGridA({ onClick }: Props) {
  const listAColWidths = use$THREE_LIST$Store((s) => s.listAColWidths);
  const setListAColWidths = use$THREE_LIST$Store((s) => s.setListAColWidths);
  const listASelectedRowKey = use$THREE_LIST$Store((s) => s.listASelectedRowKey);
  const listACheckedIndexes = use$THREE_LIST$Store((s) => s.listACheckedIndexes);
  const setListACheckedIndexes = use$THREE_LIST$Store((s) => s.setListACheckedIndexes);
  const listAData = use$THREE_LIST$Store((s) => s.listAData);
  const spinning = use$THREE_LIST$Store((s) => s.spinning);

  const addListAData = use$THREE_LIST$Store((s) => s.addListAData);
  const delListAData = use$THREE_LIST$Store((s) => s.delListAData);
  const setListAData = use$THREE_LIST$Store((s) => s.setListAData);

  const { t } = useI18n();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  const handleColumnsChange = React.useCallback(
    (columnIndex: number, width: number, columns: AXFDGColumn<DtoItem>[]) => {
      setListAColWidths(columns.map((column) => column.width));
    },
    [setListAColWidths]
  );

  const handleAddSubItem = React.useCallback(() => {
    addListAData([
      {
        type: "",
        useYn: "Y",
      },
    ]);
  }, [addListAData]);

  const handleDelSubItem = React.useCallback(() => {
    if (listACheckedIndexes) delListAData(listACheckedIndexes);
  }, [delListAData, listACheckedIndexes]);

  const handleChangeData = React.useCallback(
    (ri, ci, item) => {
      setListAData([...listAData]);
    },
    [listAData, setListAData]
  );

  const columns = React.useMemo(
    () =>
      (
        [
          {
            key: "_",
            label: t.pages.example.datagrid.status,
            align: "left",
            width: 80,
            itemRender: ({ item }) => {
              return item.status !== undefined ? ITEM_STAT[item.status] : "";
            },
          },
          {
            key: "code",
            label: t.pages.example.datagrid.code,
            align: "left",
            width: 80,
            itemRender: InputEditor,
          },
          {
            key: "type",
            label: t.pages.example.datagrid.type,
            align: "left",
            width: 100,
            itemRender: InputEditor,
          },          
          {
            key: "useYn",
            label: t.pages.example.datagrid.useYN,
            align: "left",
            width: 120,
            itemRender: getSelectEditor([
              { value: "Y", label: "사용" },
              { value: "N", label: "사용 안함" },
            ]),
          },
        ] as AXFDGColumn<DtoItem>[]
      ).map((column, colIndex) => {
        if (listAColWidths.length > 0) {
          column.width = listAColWidths[colIndex];
          return column;
        }

        return column;
      }),
    [t, listAColWidths]
  );

  return (
    <>
      <Header>
        <div>{t.pages.example.list.title}</div>
        <ButtonGroup compact>
          <Button onClick={handleAddSubItem}>{t.button.addNew}</Button>
          <Button onClick={handleDelSubItem}>{t.button.del}</Button>
        </ButtonGroup>
      </Header>

      <Container ref={containerRef}>
        <DataGrid<DtoItem>
          frozenColumnIndex={0}
          width={containerWidth}
          height={containerHeight}
          columns={columns}
          data={listAData}
          spinning={spinning}
          onClick={onClick}
          onChangeColumns={handleColumnsChange}
          onChangeData={handleChangeData}
          rowKey={"id"}
          selectedRowKey={listASelectedRowKey ?? ""}
          rowChecked={{
            checkedIndexes: listACheckedIndexes,
            onChange: (ids, selectedAll) => {
              setListACheckedIndexes(ids);
            },
          }}
          editable
        />
      </Container>
    </>
  );
}

const Container = styled.div`
  flex: 1;
`;
const Header = styled(PageLayout.FrameHeader)``;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;

export { ListDataGridA };
