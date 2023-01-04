import React from "react";
import buildStore from "@core/stores/buildStore";
import { v4 as uuidv4 } from "uuid";
import { LanguageType } from "../../i18n";
import { ROUTES, ROUTES_LIST } from "../../router/Routes";

export interface Page {
  fixed?: boolean;
  labels?: Record<LanguageType, string>;
  path?: string;
  icon?: string;
  metaData?: Record<string, any>;
  isHome?: boolean;
}

export interface PagesGroup {
  loaded: boolean;
  pages: Map<string, Page>;
  activeTabUuid: string;
}

export interface TabPage {
  tabUuid: string;
  page: Page;
}

export interface TabsActions {
  setLoaded: (loaded: boolean) => void;
  setPages: (pagesValues: [string, Page][]) => void;
  addTab: (page: Page) => string;
  removeTab: (tabUuid: string) => void;
  removeTabs: (tabUuids: string[]) => void;
  updateTab: (tabUuid: string, page: Page) => void;
  setActiveTab: (activeTabUuid: string) => void;
  getActiveTabPage: () => TabPage;
  setActiveTabByPath: (path: string, label?: React.ReactNode) => void;
  clearTab: () => void;
  getPageByPath: (path: string) => TabPage | undefined;
  getTabMetaDataByPath: <T extends Record<string, any>>(path: string) => T | undefined;
  setTabMetaDataByPath: <T extends Record<string, any>>(path: string, metaData: Record<keyof T, any>) => void;
}

export interface TabsStore extends PagesGroup, TabsActions {}

const initialUuid = "home-tab";

const initialPage: Page = { labels: ROUTES.HOME.labels, path: ROUTES.HOME.path, fixed: true, isHome: true };
export const tabsInitialState: PagesGroup = {
  loaded: false,
  pages: new Map<string, Page>([[initialUuid, initialPage]]),
  activeTabUuid: initialUuid,
};

export const usePageTabStore = buildStore<TabsStore>(
  "page-tab",
  2,
  (set, get) => ({
    ...tabsInitialState,
    setLoaded: (loaded: boolean) => set({ loaded }),
    setPages: (pagesValues) => {
      set({ pages: new Map(pagesValues) });
    },
    addTab: (page) => {
      const pages = get().pages;
      const pagesEntries = [...pages];
      const existsPageEntry = pagesEntries.find(([, _page]) => _page.path === page.path);
      if (existsPageEntry) {
        return existsPageEntry[0];
      }

      const tabUuid = uuidv4();
      pages.set(tabUuid, page);
      set({ pages: new Map([...pages]) });
      return tabUuid;
    },
    removeTab: (tabUuid) => {
      const pages = get().pages;
      if (!pages.get(tabUuid)?.isHome) {
        pages.delete(tabUuid);
        set({ pages: new Map([...pages]) });
      }
      return get().getActiveTabPage();
    },
    removeTabs: (tabUuids) => {
      const pages = get().pages;
      tabUuids.forEach((tabUuid) => pages.delete(tabUuid));

      set({ pages: new Map([...pages]) });
      return get().getActiveTabPage();
    },
    updateTab: (tabUuid, page) => {
      const pages = get().pages;
      pages.set(tabUuid, page);
      set({ pages: new Map([...pages]) });
    },
    setActiveTab: (activeTabUuid) => {
      set({ activeTabUuid });
    },
    getActiveTabPage: () => {
      const activeTabUuid = get().activeTabUuid;
      const pages = get().pages;
      const tabPage = pages.get(activeTabUuid);
      if (tabPage) {
        return {
          tabUuid: activeTabUuid,
          page: tabPage,
        };
      }

      const pagesEntries = [...pages];
      const pageEntry = pagesEntries[pagesEntries.length - 1];
      if (pageEntry) {
        set({ activeTabUuid: pageEntry[0] });
        return {
          tabUuid: pageEntry[0],
          page: pageEntry[1],
        };
      }

      const tabUuid = uuidv4();
      pages.set(tabUuid, initialPage);
      set({ activeTabUuid: tabUuid });
      return {
        tabUuid,
        page: initialPage,
      };
    },
    setActiveTabByPath: (path) => {
      const pagesEntries = [...get().pages];
      const existsPageEntry = pagesEntries.find(([, _page]) => _page.path === path);

      if (existsPageEntry) {
        set({ activeTabUuid: existsPageEntry[0] });
      } else {
        const existsRoute = ROUTES_LIST.find((route) => route.path === path);
        if (existsRoute && !existsRoute.hideTab) {
          const addedTabUuid = get().addTab({
            labels: existsRoute.labels,
            path,
            fixed: false,
          });
          get().setActiveTab(addedTabUuid);
        }
      }
    },
    clearTab: () => {
      get().pages.forEach((value, key, map) => {
        if (!value.fixed) {
          map.delete(key);
        }
      });
      set({ pages: new Map([...get().pages]) });
    },
    getPageByPath: (path) => {
      const pages = get().pages;
      const tabUuid = [...pages].find(([, v]) => v.path === path)?.[0] ?? "";
      const page = pages.get(tabUuid);

      if (!page) return;

      return {
        tabUuid,
        page,
      };
    },
    getTabMetaDataByPath: <T>(path) => {
      const pages = get().pages;
      const tabUuid = [...pages].find(([, v]) => v.path === path)?.[0] ?? "";
      return pages.get(tabUuid)?.metaData as T;
    },
    setTabMetaDataByPath: (path, metaData) => {
      const tabPage = get().getPageByPath(path);
      if (tabPage) {
        tabPage.page.metaData = metaData;
        get().updateTab(tabPage.tabUuid, tabPage.page);
      }
    },
  }),
  (storageValue) => {
    storageValue.state.activeTabUuid = initialUuid;
    return storageValue;
  }
);

usePageTabStore.persist.onFinishHydration((state) => {
  if (!state.loaded) {
    state.setLoaded(true);
  }
});

export const setMetaDataByPath = <T extends Record<string, any>>(routePath: string, metaData: Record<keyof T, any>) => {
  usePageTabStore.getState().setTabMetaDataByPath<T>(routePath, metaData);
};

export const getMetaDataByPath = <T extends Record<string, any>>(routePath: string) => {
  return usePageTabStore.getState().getTabMetaDataByPath<T>(routePath);
};
