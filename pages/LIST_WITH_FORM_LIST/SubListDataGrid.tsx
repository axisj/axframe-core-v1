import * as React from "react";
import styled from "@emotion/styled";
import { ExampleSubItem } from "@core/services/example/ExampleRepositoryInterface";
import { DataGrid } from "@core/components/DataGrid";
import { useContainerSize, useI18n } from "@core/hooks";
import { AXFDGColumn, AXFDGDataItemStatus } from "@axframe/datagrid";
import { use$LIST_WITH_FORM_LIST$Store } from "./use$LIST_WITH_FORM_LIST$Store";
import { Button, Tag } from "antd";
import { PageLayout } from "../../../styles/pageStyled";
import { getSelectEditor, InputEditor } from "components/dataGridEditor";

interface DtoItem extends ExampleSubItem {}

interface Props {}

const ITEM_STAT = {
  [AXFDGDataItemStatus.new]: <Tag color='processing'>C</Tag>,
  [AXFDGDataItemStatus.edit]: <Tag color='warning'>U</Tag>,
  [AXFDGDataItemStatus.remove]: <Tag color='error'>D</Tag>,
};

function SubListDataGrid({}: Props) {
  const subListColWidths = use$LIST_WITH_FORM_LIST$Store((s) => s.subListColWidths);
  const subListData = use$LIST_WITH_FORM_LIST$Store((s) => s.subListData);
  const subListSpinning = use$LIST_WITH_FORM_LIST$Store((s) => s.subListSpinning);
  const subListSelectedRowKey = use$LIST_WITH_FORM_LIST$Store((s) => s.subListSelectedRowKey);
  const setSubListColWidths = use$LIST_WITH_FORM_LIST$Store((s) => s.setSubListColWidths);

  const addSubList = use$LIST_WITH_FORM_LIST$Store((s) => s.addSubList);
  const delSubList = use$LIST_WITH_FORM_LIST$Store((s) => s.delSubList);
  const subListCheckedIndexes = use$LIST_WITH_FORM_LIST$Store((s) => s.subListCheckedIndexes);
  const setSubListCheckedIndexes = use$LIST_WITH_FORM_LIST$Store((s) => s.setSubListCheckedIndexes);

  const { t } = useI18n();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  const handleColumnsChange = React.useCallback(
    (columnIndex: number, width: number, columns: AXFDGColumn<DtoItem>[]) => {
      setSubListColWidths(columns.map((column) => column.width));
    },
    [setSubListColWidths]
  );

  const handleAddSubItem = React.useCallback(() => {
    addSubList([
      {
        code: "",
        type: "",
        useYn: "Y",
      },
    ]);
  }, [addSubList]);

  const handleDelSubItem = React.useCallback(() => {
    if (subListCheckedIndexes) delSubList(subListCheckedIndexes);
  }, [delSubList, subListCheckedIndexes]);

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
        if (subListColWidths.length > 0) {
          column.width = subListColWidths[colIndex];
          return column;
        }

        return column;
      }),
    [subListColWidths]
  );

  return (
    <>
      <FormBoxHeader>
        <div>LIST</div>
        <ButtonGroup compact>
          <Button onClick={handleAddSubItem}>{t.button.addNew}</Button>
          <Button onClick={handleDelSubItem}>{t.button.del}</Button>
        </ButtonGroup>
      </FormBoxHeader>

      <Container ref={containerRef}>
        <DataGrid<DtoItem>
          frozenColumnIndex={0}
          width={containerWidth}
          height={containerHeight}
          columns={columns}
          data={subListData}
          spinning={subListSpinning}
          onChangeColumns={handleColumnsChange}
          rowKey={"code"}
          selectedRowKey={subListSelectedRowKey ?? ""}
          rowChecked={{
            checkedIndexes: subListCheckedIndexes,
            onChange: (ids, selectedAll) => {
              console.log("onChange rowSelection", ids, selectedAll);
              setSubListCheckedIndexes(ids);
            },
          }}
          editable
        />
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 300px;
`;
const FormBoxHeader = styled(PageLayout.ContentBoxHeader)``;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;

export { SubListDataGrid };
