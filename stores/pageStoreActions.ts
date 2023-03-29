import { getMetaDataByPath, setMetaDataByPath, usePageTabStore } from "./usePageTabStore";
import { UserService } from "../../services";
import { ROUTES_LIST } from "../../router";

interface PageStoreConfig {
  unSubscribe?: () => void;
  createState?: Record<string, any>;
}

export const pageStoreActions = (set, get, config?: PageStoreConfig) => ({
  init: async () => {
    set({ routePath: location.pathname });
    const metaData = getMetaDataByPath(location.pathname);

    const currentRoute = ROUTES_LIST.find((route) => route.path === location.pathname);
    if (currentRoute) {
      const data = await UserService.getProgramFn({ progCd: currentRoute.program_type });

      const programFn = data.ds.reduce((acc, cur) => {
        return { ...acc, [cur.key]: cur.label };
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
  },
  reset: async () => {
    const routePath = get().routePath;
    if (!routePath) return;

    setMetaDataByPath(routePath, {});

    if (config?.createState) {
      const currentRoute = ROUTES_LIST.find((route) => route.path === location.pathname);
      if (currentRoute) {
        const data = await UserService.getProgramFn({ progCd: currentRoute.program_type });
        const programFn = data.ds.reduce((acc, cur) => {
          return { ...acc, [cur.key]: cur.label };
        }, {});

        config.createState.programFn = programFn;
      }

      set(config.createState);
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

      if (config?.createState) {
        set(config.createState);
      } else {
        get().syncMetadata();
      }
      config?.unSubscribe?.();
    }
  },
});
