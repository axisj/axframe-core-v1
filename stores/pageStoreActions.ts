import { getMetaDataByPath, setMetaDataByPath } from "./usePageTabStore";

export const pageStoreActions = (set, get, unSubscribe) => ({
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
    unSubscribe();
  },
});
