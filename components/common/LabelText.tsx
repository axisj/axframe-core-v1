import * as React from "react";
import styled from "@emotion/styled";

interface Props {
  role?: string;
  label?: string;
  children?: React.ReactNode;
}

export function LabelText({ role, label, children }: Props) {
  return (
    <TextContainer role={role}>
      <Label>{label}</Label>
      {children}
    </TextContainer>
  );
}

const TextContainer = styled.div`
  font-size: inherit;
  font-weight: normal;
  color: ${(p) => p.theme.text_body_color};
  line-height: 1.45;
`;
const Label = styled.div`
  color: ${(p) => p.theme.text_heading_color};
  margin-bottom: 3px;
  font-weight: bold;
`;
