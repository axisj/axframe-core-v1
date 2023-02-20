import * as React from "react";
import styled from "@emotion/styled";
import { SMixinFlexRow } from "@core/styles/emotion";
import { ROUTES_LIST, useAppMenu } from "router";
import { MenuIcon } from "components/MenuIcon";
import { Breadcrumb } from "antd";
import { useI18n } from "../../hooks";

interface Props {
  title: string;
  icon?: React.ReactNode;
  disableIcon?: boolean;
  children?: React.ReactNode;
}

interface BreadCrumb {
  iconTy: string;
  multiLanguage: { en: string; ko: string };
  keyPath: number[];
}

function ProgramTitle({ title, icon, disableIcon, children }: Props) {
  const { currentLanguage } = useI18n();
  const { APP_MENUS, MENUS_LIST } = useAppMenu();
  const route = ROUTES_LIST.find((route) => route.path === location.pathname);

  const { iconTy, breadCrumbs } = React.useMemo(() => {
    const currentMenu = MENUS_LIST.find((m) => m.progCd === route?.program_type);

    const breadCrumbs: BreadCrumb[] = [];
    currentMenu?.keyPath?.reduce((acc, cur) => {
      console.log(acc[cur].iconTy, acc[cur].multiLanguage, acc[cur].keyPath);
      breadCrumbs.push({
        iconTy: acc[cur].iconTy,
        multiLanguage: acc[cur].multiLanguage,
        keyPath: acc[cur].keyPath,
      });
      return acc[cur].children;
    }, APP_MENUS as any);

    return {
      iconTy: currentMenu?.iconTy,
      breadCrumbs,
    };
  }, [APP_MENUS, MENUS_LIST, route?.program_type]);

  return (
    <Container>
      {disableIcon
        ? null
        : icon ?? <MenuIcon typeName={iconTy ?? "Default"} color={"#0281FE"} secondColor={"#0281FE"} fontSize={22} />}
      <TitleWrap>{title}</TitleWrap>
      <Breadcrumb separator='>'>
        {breadCrumbs.map((breadCrumb) => {
          return (
            <Breadcrumb.Item key={breadCrumb.keyPath.join()}>
              {breadCrumb.multiLanguage[currentLanguage]}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
      {children}
    </Container>
  );
}

const Container = styled.div`
  ${SMixinFlexRow("flex-start", "center")};
  gap: 5px;

  .ant-breadcrumb {
    font-weight: 400;
    .ant-breadcrumb-separator {
      margin-inline: 4px;
    }
  }
`;
const TitleWrap = styled.div`
  margin-right: 10px;
  margin-left: 4px;
`;

export { ProgramTitle };
