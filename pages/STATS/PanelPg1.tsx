import * as React from "react";
import styled from "@emotion/styled";
import { StatTable } from "@core/components/StatTable";

interface Props {}

function PanelPg1({}: Props) {
  return (
    <Container>
      <StatTable colGroups={[]} head={[]}>
        <tbody>
          <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
        </tbody>
      </StatTable>
    </Container>
  );
}

const Container = styled.div``;

export { PanelPg1 };
