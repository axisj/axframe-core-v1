import { getMetaDataByPath, setMetaDataByPath, usePageTabStore } from "./usePageTabStore";

interface PageStoreConfig {
  unSubscribe?: () => void;
  initialState?: Record<string, any>;
}

export const pageStoreActions = (set, get, config?: PageStoreConfig) => ({
  init: () => {
    set({ routePath: location.pathname });
    const metaData = getMetaDataByPath(location.pathname);
    if (metaData) get().syncMetadata(metaData);
  },
  reset: () => {
    const routePath = get().routePath;
    if (!routePath) return;

    setMetaDataByPath(routePath, {});
    if (config?.initialState) {
      set(config.initialState);
    } else {
      get().syncMetadata();
    }
  },
  destroy: () => {
    const routePath = get().routePath;
    if (!routePath) return;
    const page = usePageTabStore.getState().getPageByPath(routePath);
    if (!page) {
      setMetaDataByPath(routePath, {});

      if (config?.initialState) {
        set(config.initialState);
      } else {
        get().syncMetadata();
      }
      config?.unSubscribe?.();
    }
  },
});
