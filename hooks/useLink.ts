import * as React from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { usePageTabStore } from "stores";
import { getFlattedMenus } from "@core/utils/store";
import { MenuItem, RawRoute, ROUTES_LIST, useAppMenu } from "router";
import { stringFormat } from "@core/utils/string";

export function useLink() {
  const navigate = useNavigate();
  const addTab = usePageTabStore((s) => s.addTab);
  const updateTab = usePageTabStore((s) => s.updateTab);
  const setActiveTab = usePageTabStore((s) => s.setActiveTab);
  const getActiveTabPage = usePageTabStore((s) => s.getActiveTabPage);
  const { MENUS_LIST } = useAppMenu();

  const linkByTo = React.useCallback(
    (to: string) => {
      const linkToMenu = getFlattedMenus([]).find((fMenu) => fMenu?.key === to);

      const labels = linkToMenu?.labels;
      const { tabUuid, page } = getActiveTabPage();

      if (page.path === "about:blank") {
        updateTab(tabUuid, { ...page, labels, path: to });
        navigate(to);
        return;
      }

      const addedTabUuid = addTab({
        labels,
        path: to,
        fixed: false,
      });
      setActiveTab(addedTabUuid);

      navigate(to);
    },
    [addTab, getActiveTabPage, navigate, setActiveTab, updateTab]
  );

  const linkByRoute = React.useCallback(
    (route: RawRoute, params: Record<string, any>) => {
      const labels = { en: route.program_type as string, ko: route.program_type as string };
      const { tabUuid, page } = getActiveTabPage();

      if (route.program_type) {
        const menu = MENUS_LIST.find((menu) => menu.progCd === route.program_type);
        labels.en = stringFormat(menu?.multiLanguage.en ?? (route.program_type as string), params);
        labels.ko = stringFormat(menu?.multiLanguage.ko ?? (route.program_type as string), params);
      }

      const path = generatePath(route.path, params);

      if (page.path === "about:blank") {
        updateTab(tabUuid, { ...page, labels, path });
        navigate(path);
        return;
      }

      const addedTabUuid = addTab({
        labels,
        path,
        fixed: false,
      });
      setActiveTab(addedTabUuid);

      navigate(path);
    },
    [MENUS_LIST, addTab, getActiveTabPage, navigate, setActiveTab, updateTab]
  );

  const linkByMenu = React.useCallback(
    (menu: MenuItem) => {
      if (menu.program_type) {
        const route = ROUTES_LIST.find((route) => route.program_type === menu.program_type);

        if (!route) return;

        const labels = menu.labels;
        const { tabUuid, page } = getActiveTabPage();
        const path = generatePath(route.path);

        if (page.path === "about:blank") {
          updateTab(tabUuid, { ...page, labels, path });
          navigate(path);
          return;
        }

        const addedTabUuid = addTab({
          labels,
          path,
          fixed: false,
        });
        setActiveTab(addedTabUuid);

        navigate(path);
      }
    },
    [addTab, getActiveTabPage, navigate, setActiveTab, updateTab]
  );

  return {
    linkByTo,
    linkByRoute,
    linkByMenu,
  };
}
