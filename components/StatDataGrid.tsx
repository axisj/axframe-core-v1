import * as React from "react";
import styled from "@emotion/styled";
import { StatTable, StatTableProps } from "./statTable";

export function StatDataGrid<T>({ width, height, ...rest }: StatTableProps<T>) {
  if (width === 0 || height === 0) {
    return null;
  }

  return (
    <Container>
      <StatTable<T> headRowHeight={30} bodyRowHeight={34} width={width} height={height} {...rest} />
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  overflow: hidden;
`;
