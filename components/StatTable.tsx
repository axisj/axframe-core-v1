import * as React from "react";
import styled from "@emotion/styled";

export interface StatCol {
  width?: number;
}

export interface StatHeadTd {
  colspan?: number;
  rowspan?: number;
}

export interface StatHeadTr {
  children?: StatHeadTd[];
}

interface Props {
  style?: React.CSSProperties;
  className?: string;
  colGroups: StatCol[];
  head: StatHeadTr[];
  children?: React.ReactNode;
}

function StatTable({ colGroups, head, children }: Props) {
  return <Container>{children}</Container>;
}

const Container = styled.table``;

StatTable.tbody = styled.tbody``;
StatTable.tr = styled.tr``;
StatTable.td = styled.td``;

export { StatTable };
