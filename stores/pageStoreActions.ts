import { getMetaDataByPath, setMetaDataByPath, usePageTabStore } from "./usePageTabStore";
import { UserService } from "services";
import { ROUTES_LIST } from "router";
import { matchPath } from "react-router-dom";

interface PageStoreConfig {
  unSubscribe?: () => void;
  createState?: Record<string, any>;
}

export const pageStoreActions = (set, get, config?: PageStoreConfig) => ({
  init: async () => {
    const metaData = getMetaDataByPath(get().routePath);

    const currentRoute = ROUTES_LIST.find((route) => matchPath(route.path, location.pathname));
    if (currentRoute) {
      const data = await UserService.getProgramFn({ progCd: currentRoute.program_type, apiUrl: location.pathname });

      const programFn = data.ds.reduce((acc, cur) => {
        return { ...acc, [cur]: true };
      }, {});

      if (metaData) {
        metaData.programFn = programFn;
      } else if (config?.createState) {
        config.createState.programFn = programFn;
      }
    }

    if (metaData) {
      get().syncMetadata(metaData);
    } else if (config?.createState) {
      set(config.createState);
    }

    await get().onMountApp();
  },
  reset: async () => {
    const routePath = get().routePath;
    if (!routePath) return;

    setMetaDataByPath(routePath, {});

    if (config?.createState) {
      const currentRoute = ROUTES_LIST.find((route) => matchPath(route.path, location.pathname));
      if (currentRoute) {
        const data = await UserService.getProgramFn({ progCd: currentRoute.program_type, apiUrl: location.pathname });
        config.createState.programFn = data.ds.reduce((acc, cur) => {
          return { ...acc, [cur]: true };
        }, {});
      }

      set(config.createState);
    } else {
      get().syncMetadata();
    }

    await get().onMountApp();
  },
  destroy: () => {
    const routePath = get().routePath;
    if (!routePath) return;
    const page = usePageTabStore.getState().getPageByPath(routePath);
    if (!page) {
      setMetaDataByPath(routePath, {});

      if (config?.createState) {
        set(config.createState);
      } else {
        get().syncMetadata();
      }
      config?.unSubscribe?.();
    }
  },
});
