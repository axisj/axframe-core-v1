import { getMetaDataByPath, setMetaDataByPath } from "./usePageTabStore";

export const pageStoreActions = (set, get, unSubscribe) => ({
  init: (routePath) => {
    const metaData = getMetaDataByPath(routePath);
    if (metaData) get().syncMetadata(metaData);

    set({ routePath });
  },
  reset: () => {
    const routePath = get().routePath;
    if (!routePath) return;

    setMetaDataByPath(routePath, {});
    get().syncMetadata();
  },
  destroy: () => {
    unSubscribe();
  },
});
