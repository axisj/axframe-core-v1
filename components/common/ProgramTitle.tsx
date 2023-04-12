import * as React from "react";
import styled from "@emotion/styled";
import { SMixinFlexRow } from "@core/styles/emotion";
import { ROUTES_LIST, useAppMenu } from "router";
import { MenuIcon } from "components/MenuIcon";
import { Breadcrumb } from "antd";
import { useI18n, useLink } from "../../hooks";
import { AppMenu } from "../../../services";

interface Props {
  title?: string;
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
  const { linkByRoute } = useLink();
  const currentRoute = ROUTES_LIST.find((route) => route.path === location.pathname);

  const { iconTy, breadCrumbs } = React.useMemo(() => {
    const currentMenu = MENUS_LIST.find((m) => m.progCd === currentRoute?.program_type);

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
  }, [APP_MENUS, MENUS_LIST, currentRoute?.program_type]);

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
      if (idx < breadCrumbs.length - 1) {
        return {
          key: item.keyPath.join("."),
          title: item.multiLanguage[currentLanguage],
        };
      }

      const menuItems = breadCrumbs[breadCrumbs.length - 2]?.children.map((b, bidx) => {
        const menu = {
          key: b.keyPath?.join(".") ?? bidx + "",
          label: b.multiLanguage[currentLanguage],
          program_type: b.progCd,
        };

        return {
          ...menu,
          onClick: () => {
            handleClickMenu(menu);
          },
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
  }, [breadCrumbs, currentLanguage, handleClickMenu]);

  const currentMenu = React.useMemo(() => {
    if (currentRoute) {
      return MENUS_LIST.find((m) => m.progCd === currentRoute.program_type);
    }
  }, [MENUS_LIST, currentRoute]);

  return (
    <Container>
      {disableIcon
        ? null
        : icon ?? <MenuIcon typeName={iconTy ?? "Default"} color={"#0281FE"} secondColor={"#0281FE"} fontSize={22} />}
      <TitleWrap>{title ?? currentMenu?.multiLanguage[currentLanguage]}</TitleWrap>
      <Breadcrumb items={bItems} />
      {children}
    </Container>
  );
}

const Container = styled.div`
  ${SMixinFlexRow("flex-start", "center")};
  gap: 5px;
  min-height: 32px;

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
