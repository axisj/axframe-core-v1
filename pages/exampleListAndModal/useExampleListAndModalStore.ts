import create from "zustand";
import {
  ExampleDetailRequest,
  ExampleItem,
  ExampleListRequest,
  ExampleListResponse,
} from "@core/services/example/ExampleRepositoryInterface";
import { AXFDGDataItem, AXFDGPage, AXFDGSortParam } from "@axframe/datagrid";
import { ExampleService } from "services";
import { errorDialog } from "@core/components/dialogs/errorDialog";
import { setMetaDataByPath } from "@core/stores/usePageTabStore";
import { subscribeWithSelector } from "zustand/middleware";
import shallow from "zustand/shallow";
import { PageStoreActions, StoreActions } from "@core/stores/types";
import { pageStoreActions } from "@core/stores/pageStoreActions";

interface APIRequest extends ExampleListRequest {}
interface APIResponse extends ExampleListResponse {}
interface APIDetailRequest extends ExampleDetailRequest {}

interface MetaData {
  listRequestValue: APIRequest;
  listColWidths: number[];
  listSortParams: AXFDGSortParam[];
}

interface States extends MetaData {
  routePath?: string; // initialized Store;
  listSpinning: boolean;
  listData: AXFDGDataItem<ExampleItem>[];
  listPage: AXFDGPage;
  detailSpinning: boolean;
  detail?: ExampleItem;
}

interface Actions extends PageStoreActions<States> {
  setListRequestValue: (requestValue: APIRequest) => void;
  setListColWidths: (colWidths: number[]) => void;
  setListSpinning: (spinning: boolean) => void;
  setListSortParams: (sortParams: AXFDGSortParam[]) => void;
  callListApi: (request?: APIRequest) => Promise<void>;
  changeListPage: (currentPage: number, pageSize?: number) => Promise<void>;
  setDetailSpinning: (spinning: boolean) => void;
  callDetailApi: (request?: APIDetailRequest) => Promise<void>;
}

// create states
const _listRequestValue = {
  pageNumber: 1,
  pageSize: 100,
};
const createState: States = {
  listRequestValue: { ..._listRequestValue },
  listColWidths: [],
  listSpinning: false,
  listData: [],
  listPage: {
    currentPage: 0,
    totalPages: 0,
  },
  listSortParams: [],
  detailSpinning: false,
};

// create actions
const createActions: StoreActions<States & Actions, Actions> = (set, get) => ({
  setListRequestValue: (requestValues) => {
    set({ listRequestValue: requestValues });
  },
  setListColWidths: (colWidths) => set({ listColWidths: colWidths }),
  setListSpinning: (spinning) => set({ listSpinning: spinning }),
  setListSortParams: (sortParams) => set({ listSortParams: sortParams }),
  callListApi: async (request) => {
    await set({ listSpinning: true });

    try {
      const apiParam = request ?? get().listRequestValue;
      const response = await ExampleService.list(apiParam);

      set({
        listData: response.ds.map((values) => ({
          values,
        })),
        listPage: {
          currentPage: response.rs.pageNumber ?? 1,
          pageSize: response.rs.pageSize ?? 0,
          totalPages: response.rs.pgCount ?? 0,
          totalElements: response.ds.length,
        },
      });
    } catch (e) {
      await errorDialog(e as any);
    } finally {
      await set({ listSpinning: false });
    }
  },
  changeListPage: async (pageNumber, pageSize) => {
    const exampleListRequestValues = {
      ...get().listRequestValue,
      pageNumber,
      pageSize,
    };
    set({ listRequestValue: exampleListRequestValues });
    await get().callListApi();
  },
  setDetailSpinning: (spinning) => set({ detailSpinning: spinning }),
  callDetailApi: async (request) => {
    await set({ detailSpinning: true });

    try {
      const response = await ExampleService.detail(request);
      console.log(response);

      set({ detail: response.rs });
    } catch (e) {
      await errorDialog(e as any);
    } finally {
      await set({ detailSpinning: false });
    }
  },
  syncMetadata: (metaData) => {
    if (metaData) {
      console.log(`apply metaData Store : useExampleListStore`);
      set({
        listSortParams: metaData.listSortParams,
        listRequestValue: metaData.listRequestValue,
        listColWidths: metaData.listColWidths,
      });
    } else {
      console.log(`clear metaData Store : useExampleListStore`);
      set({
        listRequestValue: _listRequestValue,
      });
    }
  },
  ...pageStoreActions(set, get, () => unSubscribeExampleListStore()),
});

// ---------------- exports
export interface ExampleListStore extends States, Actions, PageStoreActions<States> {}
export const useExampleListAndModalStore = create(
  subscribeWithSelector<ExampleListStore>((set, get) => ({
    ...createState,
    ...createActions(set, get),
  }))
);

// pageModel 에 저장할 대상 모델 셀렉터 정의
export const unSubscribeExampleListStore = useExampleListAndModalStore.subscribe(
  (s) => [s.listSortParams, s.listRequestValue, s.listColWidths],
  ([listSortParams, listRequestValue, listColWidths]) => {
    const routePath = useExampleListAndModalStore.getState().routePath;
    if (!routePath) return;
    console.log(`Save metaData '${routePath}', Store : useExampleListAndModalStore`);

    setMetaDataByPath<MetaData>(routePath, {
      listSortParams,
      listRequestValue,
      listColWidths,
    });
  },
  { equalityFn: shallow }
);
