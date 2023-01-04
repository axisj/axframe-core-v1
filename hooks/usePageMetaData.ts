import * as React from "react";
import { usePageTabStore, Page } from "stores";

export function usePageMetaData<T = Record<string, any>>(path: string) {
  const pages = usePageTabStore((s) => s.pages);
  const updateTab = usePageTabStore((s) => s.updateTab);
  const tabUuid = React.useMemo(() => [...pages].find(([, v]) => v.path === path)?.[0] ?? "", [pages, path]);
  const currentPage = React.useMemo(
    () =>
      pages.get(tabUuid) ??
      ({
        labels: {
          en: "",
          ko: "",
        },
      } as Page),
    [pages, tabUuid]
  );

  const setPageMetadata = React.useCallback(
    (metaData: T) => {
      if (currentPage && tabUuid) {
        currentPage.metaData = metaData as Record<string, any>;
        updateTab(tabUuid, currentPage);
      }
    },
    [currentPage, tabUuid, updateTab]
  );

  const pageMetadata = currentPage.metaData as T;

  return {
    currentPage,
    pageMetadata,
    setPageMetadata,
  };
}
