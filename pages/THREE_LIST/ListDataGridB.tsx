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

function ListDataGridB({ onClick }: Props) {
  const listBColWidths = use$THREE_LIST$Store((s) => s.listBColWidths);
  const setListBColWidths = use$THREE_LIST$Store((s) => s.setListBColWidths);
  const listBSelectedRowKey = use$THREE_LIST$Store((s) => s.listBSelectedRowKey);
  const listBCheckedIndexes = use$THREE_LIST$Store((s) => s.listBCheckedIndexes);
  const setListBCheckedIndexes = use$THREE_LIST$Store((s) => s.setListBCheckedIndexes);
  const listBData = use$THREE_LIST$Store((s) => s.listBData);
  const spinning = use$THREE_LIST$Store((s) => s.spinning);

  const addListBData = use$THREE_LIST$Store((s) => s.addListBData);
  const delListBData = use$THREE_LIST$Store((s) => s.delListBData);
  const setListBData = use$THREE_LIST$Store((s) => s.setListBData);

  const { t } = useI18n();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  const handleColumnsChange = React.useCallback(
    (columnIndex: number, width: number, columns: AXFDGColumn<DtoItem>[]) => {
      setListBColWidths(columns.map((column) => column.width));
    },
    [setListBColWidths]
  );

  const handleAddSubItem = React.useCallback(() => {
    addListBData([
      {
        type: "",
        useYn: "Y",
      },
    ]);
  }, [addListBData]);

  const handleDelSubItem = React.useCallback(() => {
    if (listBCheckedIndexes) delListBData(listBCheckedIndexes);
  }, [delListBData, listBCheckedIndexes]);

  const handleChangeData = React.useCallback(
    (ri, ci, item) => {
      setListBData([...listBData]);
    },
    [listBData, setListBData]
  );

  const columns = React.useMemo(
    () =>
      (
        [
          {
            key: "_",
            label: "Status",
            align: "left",
            width: 80,
            itemRender: ({ item }) => {
              return item.status !== undefined ? ITEM_STAT[item.status] : "";
            },
          },
          { key: "code", label: "Code", align: "left", width: 80, itemRender: InputEditor },
          { key: "type", label: "Type", align: "left", width: 100, itemRender: InputEditor },
          {
            key: "useYn",
            label: "Use YN",
            align: "left",
            width: 120,
            itemRender: getSelectEditor([
              { value: "Y", label: "사용" },
              { value: "N", label: "사용안함" },
            ]),
          },
        ] as AXFDGColumn<DtoItem>[]
      ).map((column, colIndex) => {
        if (listBColWidths.length > 0) {
          column.width = listBColWidths[colIndex];
          return column;
        }

        return column;
      }),
    [listBColWidths]
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
          data={listBData}
          spinning={spinning}
          onClick={onClick}
          onChangeColumns={handleColumnsChange}
          onChangeData={handleChangeData}
          rowKey={"id"}
          selectedRowKey={listBSelectedRowKey ?? ""}
          rowChecked={{
            checkedIndexes: listBCheckedIndexes,
            onChange: (ids, selectedAll) => {
              setListBCheckedIndexes(ids);
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

export { ListDataGridB };
