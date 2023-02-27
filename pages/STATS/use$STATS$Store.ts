import create from "zustand";
import { ExampleItem, ExampleListRequest } from "@core/services/example/ExampleRepositoryInterface";
import { ExampleService } from "services";
import { errorDialog } from "@core/components/dialogs/errorDialog";
import { setMetaDataByPath } from "@core/stores/usePageTabStore";
import { subscribeWithSelector } from "zustand/middleware";
import shallow from "zustand/shallow";
import { PageStoreActions, StoreActions } from "@core/stores/types";
import { pageStoreActions } from "@core/stores/pageStoreActions";
import { ROUTES } from "router/Routes";
import { pick } from "lodash";

interface ListRequest extends ExampleListRequest {}
interface DtoItem extends ExampleItem {}
export type PanelType = "pg1" | "pg2";

interface MetaData {
  requestValue: ListRequest;
  listColWidths: number[];
  activeTabKey: PanelType;
}

interface States extends MetaData {
  routePath: string; // initialized Store;
  spinning: boolean;
  listData: DtoItem[];
}

interface Actions extends PageStoreActions<States> {
  callListApi: (request?: ListRequest) => Promise<void>;
  setRequestValue: (requestValue: ListRequest) => void;
  setListColWidths: (colWidths: number[]) => void;
  setActiveTabKey: (key: PanelType) => void;
}

// create states
const createState: States = {
  routePath: ROUTES.EXAMPLES.children.STATS.path,
  requestValue: {
    pageNumber: 1,
    pageSize: 100,
  },
  listColWidths: [],
  spinning: false,
  listData: [],
  activeTabKey: "pg1",
};

// create actions
const createActions: StoreActions<States & Actions, Actions> = (set, get) => ({
  callListApi: async (request) => {
    await set({ spinning: true });

    try {
      const apiParam = request ?? get().requestValue;
      const response = await ExampleService.list(apiParam);

      set({
        listData: response.ds,
      });
    } catch (e) {
      await errorDialog(e as any);
    } finally {
      await set({ spinning: false });
    }
  },
  setRequestValue: (requestValues) => set({ requestValue: requestValues }),
  setListColWidths: (colWidths) => set({ listColWidths: colWidths }),
  setActiveTabKey: (key) => set({ activeTabKey: key }),

  syncMetadata: (metaData) => {
    const metaDataKeys: (keyof MetaData)[] = ["requestValue", "listColWidths", "activeTabKey"];
    set(pick(metaData ?? createState, metaDataKeys));
  },

  ...pageStoreActions(set, get),
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
  (s) => [s.requestValue, s.listColWidths, s.activeTabKey],
  ([requestValue, listColWidths, activeTabKey]) => {
    setMetaDataByPath<MetaData>(createState.routePath, {
      requestValue,
      listColWidths,
      activeTabKey,
    });
  },
  { equalityFn: shallow }
);
