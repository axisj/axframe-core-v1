import * as React from "react";
import { useNavigate, generatePath } from "react-router-dom";
import { MENUS } from "router/menus";
import { usePageTabStore } from "stores";
import { getFlattedMenus } from "@core/utils/store";
import { RawRoute } from "router/Routes";
import { stringFormat } from "../utils/string";

export function useLink() {
  const navigate = useNavigate();
  const addTab = usePageTabStore((s) => s.addTab);
  const updateTab = usePageTabStore((s) => s.updateTab);
  const setActiveTab = usePageTabStore((s) => s.setActiveTab);
  const getActiveTabPage = usePageTabStore((s) => s.getActiveTabPage);

  const linkByTo = React.useCallback(
    (to: string) => {
      const linkToMenu = getFlattedMenus(MENUS).find((fMenu) => fMenu?.key === to);

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
      const labels = { en: stringFormat(route.labels.en, params), ko: stringFormat(route.labels.ko, params) };
      const { tabUuid, page } = getActiveTabPage();
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
    [addTab, getActiveTabPage, navigate, setActiveTab, updateTab]
  );

  return {
    linkByTo,
    linkByRoute,
  };
}
