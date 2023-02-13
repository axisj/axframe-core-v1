import { getMetaDataByPath, setMetaDataByPath, usePageTabStore } from "./usePageTabStore";

export const pageStoreActions = (set, get, unSubscribe?: () => void) => ({
  init: () => {
    const metaData = getMetaDataByPath(get().routePath);
    if (metaData) get().syncMetadata(metaData);
  },
  reset: () => {
    const routePath = get().routePath;
    if (!routePath) return;

    setMetaDataByPath(routePath, {});
    get().syncMetadata();
  },
  destroy: () => {
    const routePath = get().routePath;
    if (!routePath) return;
    const page = usePageTabStore.getState().getPageByPath(routePath);
    if (!page) {
      setMetaDataByPath(routePath, {});
      get().syncMetadata();
      unSubscribe?.();
    }
  },
});
