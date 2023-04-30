import create from "zustand";
import { ExampleListRequest, ExampleStatItem } from "@core/services/example/ExampleRepositoryInterface";
import { ExampleService } from "services";
import { setMetaDataByPath } from "@core/stores/usePageTabStore";
import { subscribeWithSelector } from "zustand/middleware";
import shallow from "zustand/shallow";
import { PageStoreActions, StoreActions } from "@core/stores/types";
import { pageStoreActions } from "@core/stores/pageStoreActions";
import { ROUTES } from "router/Routes";
import { pick } from "lodash";
import { StatCol } from "@core/components/statTable";
import { ProgramFn } from "@types";

interface ListRequest extends ExampleListRequest {}

interface DtoItem extends ExampleStatItem {}

export type PanelType = "pg1" | "pg2";

interface MetaData {
  programFn?: ProgramFn;
  listRequestValue: ListRequest;
  colGroupsPg1?: StatCol[];
  colGroupsPg2?: StatCol[];
  activeTabKey: PanelType;
  flexGrowPg1: number;
  flexGrowPg2: number;
}

interface States extends MetaData {
  routePath: string; // initialized Store;
  spinning: boolean;
  listData: DtoItem[];
}

interface Actions extends PageStoreActions<States> {
  callListApi: (request?: ListRequest, pageNumber?: number) => Promise<void>;
  setRequestValue: (requestValue: ListRequest) => void;
  setActiveTabKey: (key: PanelType) => void;
  setFlexGrowPg1: (flexGlow: number) => void;
  setFlexGrowPg2: (flexGlow: number) => void;
  setColGroupsPg1: (colGroups: StatCol[]) => void;
  setColGroupsPg2: (colGroups: StatCol[]) => void;
}

// create states
const createState: States = {
  routePath: ROUTES.EXAMPLES.children.STATS.path,
  listRequestValue: {
    pageNumber: 1,
    pageSize: 100,
  },
  colGroupsPg1: undefined,
  colGroupsPg2: undefined,
  spinning: false,
  listData: [],
  activeTabKey: "pg1",
  flexGrowPg1: 1,
  flexGrowPg2: 1,
};

// create actions
const createActions: StoreActions<States & Actions, Actions> = (set, get) => ({
  onMountApp: async () => {},
  callListApi: async (request) => {
    if (get().spinning) return;
    await set({ spinning: true });

    try {
      const apiParam = request ?? get().listRequestValue;
      const response = await ExampleService.stat(apiParam);

      set({
        listData: response.ds,
      });
    } catch (e) {
      throw e;
    } finally {
      await set({ spinning: false });
    }
  },
  setRequestValue: (requestValues) => set({ listRequestValue: requestValues }),
  setActiveTabKey: (key) => set({ activeTabKey: key }),
  setFlexGrowPg1: (flexGlow) => set({ flexGrowPg1: flexGlow }),
  setFlexGrowPg2: (flexGlow) => set({ flexGrowPg2: flexGlow }),
  setColGroupsPg1: (colGroups) => set({ colGroupsPg1: colGroups }),
  setColGroupsPg2: (colGroups) => set({ colGroupsPg2: colGroups }),

  syncMetadata: (metaData) => {
    const metaDataKeys: (keyof MetaData)[] = [
      "programFn",
      "listRequestValue",
      "colGroupsPg1",
      "colGroupsPg2",
      "activeTabKey",
      "flexGrowPg1",
      "flexGrowPg2",
    ];
    set(pick(metaData ?? createState, metaDataKeys));
  },

  ...pageStoreActions(set, get, { createState }),
});

// ---------------- exports
export interface $STATS$Store extends States, Actions, PageStoreActions<States> {}

export const use$STATS$Store = create(
  subscribeWithSelector<$STATS$Store>((set, get) => ({
    ...createState,
    ...createActions(set, get),
  }))
);

// pageModel 에 저장할 대상 모델 셀렉터 정의
use$STATS$Store.subscribe(
  (s) => [
    s.programFn,
    s.listRequestValue,
    s.colGroupsPg1,
    s.colGroupsPg2,
    s.activeTabKey,
    s.flexGrowPg1,
    s.flexGrowPg2,
  ],
  ([programFn, listRequestValue, colGroupsPg1, colGroupsPg2, activeTabKey, flexGrowPg1, flexGrowPg2]) => {
    setMetaDataByPath<MetaData>(createState.routePath, {
      programFn,
      listRequestValue,
      colGroupsPg1,
      colGroupsPg2,
      activeTabKey,
      flexGrowPg1,
      flexGrowPg2,
    });
  },
  { equalityFn: shallow }
);
