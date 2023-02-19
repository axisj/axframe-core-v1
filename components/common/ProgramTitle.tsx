import * as React from "react";
import styled from "@emotion/styled";
import { SMixinFlexRow } from "@core/styles/emotion";
import { ROUTES_LIST, useAppMenu } from "router";
import { MenuIcon } from "components/MenuIcon";

interface Props {
  title: string;
  icon?: React.ReactNode;
  disableIcon?: boolean;
  children?: React.ReactNode;
}

function ProgramTitle({ title, icon, disableIcon, children }: Props) {
  const { MENUS_LIST } = useAppMenu();
  const route = ROUTES_LIST.find((route) => route.path === location.pathname);

  const iconTy = React.useMemo(() => {
    const currentMenu = MENUS_LIST.find((m) => m.progCd === route?.program_type);
    return currentMenu?.iconTy;
  }, [MENUS_LIST, route?.program_type]);

  return (
    <Container>
      {disableIcon
        ? null
        : icon ?? <MenuIcon typeName={iconTy ?? "Default"} color={"#0281FE"} secondColor={"#0281FE"} fontSize={20} />}
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
