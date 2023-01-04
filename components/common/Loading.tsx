import * as React from "react";
import styled from "@emotion/styled";
import { Spinner } from "./Spinner";
import { SMixinFlexColumn } from "@core/styles/emotion";
import { alpha } from "styles/palette/colorUtil";

interface Props {
  active?: boolean;
}

export function Loading({ active }: Props) {
  if (!active) return null;
  return (
    <Container>
      <Spinner />
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: ${(p) => alpha(p.theme.disabled_bg, 0.3)};

  ${SMixinFlexColumn("center", "center")};
`;
