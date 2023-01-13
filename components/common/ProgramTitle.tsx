import * as React from "react";
import styled from "@emotion/styled";
import { SMixinFlexRow } from "../../styles/emotion";
import { AXFIDefaultProgram } from "@axframe/icon";

interface Props {
  title: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

function ProgramTitle({ title, icon, children }: Props) {
  return (
    <Container>
      {icon ?? <AXFIDefaultProgram />}
      <TitleWrap>{title}</TitleWrap>
      {children}
    </Container>
  );
}

const Container = styled.div`
  ${SMixinFlexRow("flex-start", "center")};
  gap: 5px;
`;
const TitleWrap = styled.div`
  margin-right: 10px;
`;

export { ProgramTitle };
