import * as React from "react";
import styled from "@emotion/styled";
import { SMixinFlexRow } from "@core/styles/emotion";
import { ROUTES_LIST, useAppMenu } from "router";
import { MenuIcon } from "components/MenuIcon";
import { Breadcrumb } from "antd";
import { useI18n, useLink } from "../../hooks";
import { AppMenu } from "../../../services";

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
  children: AppMenu[];
}

function ProgramTitle({ title, icon, disableIcon, children }: Props) {
  const { currentLanguage } = useI18n();
  const { APP_MENUS, MENUS_LIST } = useAppMenu();
  const { linkByRoute, linkByTo } = useLink();
  const route = ROUTES_LIST.find((route) => route.path === location.pathname);

  const { iconTy, breadCrumbs } = React.useMemo(() => {
    const currentMenu = MENUS_LIST.find((m) => m.progCd === route?.program_type);

    const breadCrumbs: BreadCrumb[] = [];
    currentMenu?.keyPath?.reduce((acc, cur) => {
      breadCrumbs.push({
        iconTy: acc[cur].iconTy ?? "",
        multiLanguage: acc[cur].multiLanguage,
        keyPath: acc[cur].keyPath ?? [],
        children: acc[cur].children,
      });
      return acc[cur].children;
    }, APP_MENUS as AppMenu[]);

    return {
      iconTy: currentMenu?.iconTy,
      breadCrumbs,
    };
  }, [APP_MENUS, MENUS_LIST, route?.program_type]);

  const handleClickMenu = React.useCallback(
    (m) => {
      const mm = m.key.split(/\./g)?.reduce(
        (acc, cur) => {
          return acc.children[Number(cur)] as AppMenu;
        },
        { children: APP_MENUS as AppMenu[] }
      ) as AppMenu;
      const route = ROUTES_LIST.find((route) => route.program_type === mm.progCd);
      if (!route) return;
      linkByRoute(route, {});
    },
    [APP_MENUS, linkByRoute]
  );

  const bItems = React.useMemo(() => {
    return breadCrumbs.map((item, idx) => {
      if (idx < breadCrumbs.length - 2) {
        return {
          key: item.keyPath.join("."),
          title: item.multiLanguage[currentLanguage],
        };
      }

      const menuItems = breadCrumbs[breadCrumbs.length - 2]?.children.map((b, bidx) => {
        return {
          key: b.keyPath?.join(".") ?? bidx + "",
          label: b.multiLanguage[currentLanguage],
          program_type: b.progCd,
        };
      });

      return {
        key: item.keyPath.join("."),
        title: item.multiLanguage[currentLanguage],
        menu: menuItems
          ? {
              items: menuItems,
            }
          : undefined,
      };
    });
  }, [breadCrumbs, currentLanguage]);

  return (
    <Container>
      {disableIcon
        ? null
        : icon ?? <MenuIcon typeName={iconTy ?? "Default"} color={"#0281FE"} secondColor={"#0281FE"} fontSize={22} />}
      <TitleWrap>{title}</TitleWrap>
      <Breadcrumb items={bItems}>
        {/*{breadCrumbs.map((breadCrumb, idx) => {*/}
        {/*  return (*/}
        {/*    <Breadcrumb.Item*/}
        {/*      key={breadCrumb.keyPath.join(".")}*/}
        {/*      menu={*/}
        {/*        breadCrumbs.length - 1 === idx*/}
        {/*          ? ({*/}
        {/*              onClick: handleClickMenu,*/}
        {/*              items: menuItems,*/}
        {/*              selectedKeys: [breadCrumb.keyPath.join(".")],*/}
        {/*              className: "breadcrumb-menu",*/}
        {/*            } as any)*/}
        {/*          : undefined*/}
        {/*      }*/}
        {/*    >*/}
        {/*      {breadCrumb.multiLanguage[currentLanguage]}*/}
        {/*    </Breadcrumb.Item>*/}
        {/*  );*/}
        {/*})}*/}
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
      margin-inline: 6px;
    }
  }
`;
const TitleWrap = styled.div`
  margin-right: 10px;
  margin-left: 4px;
`;

export { ProgramTitle };
