import * as React from "react";
import styled from "@emotion/styled";
import { AXFDGProps, AXFDataGrid } from "@axframe/datagrid";

interface Props<T> extends AXFDGProps<T> {}

export function DataGrid<T>({ width, height, ...rest }: Props<T>) {
  if (width === 0 || height === 0) {
    return null;
  }

  return (
    <Container>
      <AXFDataGrid width={width} height={height} headerHeight={35} itemHeight={20} footerHeight={35} {...rest} />
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
