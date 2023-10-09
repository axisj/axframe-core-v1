import * as React from "react";
import styled from "@emotion/styled";
import { StatTable, StatTableProps } from "./statTable";

export function StatDataGrid<T>({ width, height, headRowHeight = 28, bodyRowHeight = 34, ...rest }: StatTableProps<T>) {
  if (width === 0 || height === 0) {
    return null;
  }

  return (
    <Container>
      <StatTable<T>
        className={"stat-data-grid"}
        headRowHeight={headRowHeight}
        bodyRowHeight={bodyRowHeight}
        width={width}
        height={height}
        {...rest}
      />
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  overflow: hidden;
`;
