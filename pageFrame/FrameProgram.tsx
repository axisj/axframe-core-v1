import { css } from "@emotion/react";
import styled from "@emotion/styled";
import * as React from "react";
import { Outlet } from "react-router-dom";
import { SMixinFlexColumn, SMixinFlexRow } from "@core/styles/emotion";
import NavGroup from "components/nav/NavGroup";
import TabGroup from "@core/components/tabs/TabGroup";

interface StyleProps {
  sideMenuOpened: boolean;
}

interface Props extends StyleProps {}

function FrameProgram({ sideMenuOpened }: Props) {
  return (
    <PageFrameContainer>
      <PageFrameNav sideMenuOpened={sideMenuOpened}>
        <React.Suspense fallback={<></>}>
          <NavGroup />
        </React.Suspense>
      </PageFrameNav>
      <PageFrameContent>
        <React.Suspense fallback={<></>}>
          <TabGroup />
        </React.Suspense>
        <Content>
          <React.Suspense fallback={<></>}>
            <Outlet />
          </React.Suspense>
        </Content>
      </PageFrameContent>
    </PageFrameContainer>
  );
}

const PageFrameContainer = styled.div`
  ${SMixinFlexRow("stretch", "stretch")};
  height: 100vh;
  width: 100vw;
  flex: 1;
  overflow: hidden;
`;
const PageFrameNav = styled.div<StyleProps>`
  ${SMixinFlexRow("stretch", "stretch")};
  flex: none;
  position: relative;

  ${({ sideMenuOpened, theme }) => {
    if (sideMenuOpened) {
      return css`
        width: ${theme.side_menu_open_width}px;
      `;
    }

    return css`
      width: 61px;
    `;
  }}

  z-index: 10;
`;
const PageFrameContent = styled.div`
  flex: 1;
  ${SMixinFlexColumn("stretch", "stretch")};
  overflow: hidden;
`;
const Content = styled.div`
  flex: 1;
  overflow: auto;
  ${SMixinFlexColumn("stretch", "stretch")};
`;

export default FrameProgram;
