import * as React from "react";
import styled from "@emotion/styled";
import { AXFDGProps, AXFDataGrid } from "@axframe/datagrid";

interface Props<T> extends AXFDGProps<T> {}

export function DataGrid<T>({
  frozenColumnIndex,
  width,
  height,
  columns,
  data,
  spinning,
  page,
  sort,
  onClick,
  onChangeColumns,
  rowKey,
  selectedRowKey,
  rowChecked,
  editable,
}: Props<T>) {
  // console.log("data", data, selectedRowKey);

  return (
    <Container>
      <AXFDataGrid
        headerHeight={35}
        itemHeight={20}
        footerHeight={35}
        {...{
          frozenColumnIndex,
          width,
          height,
          columns,
          data,
          spinning,
          page,
          onClick,
          sort,
          onChangeColumns,
          rowKey,
          selectedRowKey,
          rowChecked,
          editable,
        }}
      />
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  overflow: hidden;

  [role="@axframe/datagrid"] {
    //transition: all 0.1s;
  }
`;
