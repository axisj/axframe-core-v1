import create from "zustand";
import { ExampleItem, ExampleListRequest } from "@core/services/example/ExampleRepositoryInterface";
import { AXFDGDataItem, AXFDGPage, AXFDGSortParam } from "@axframe/datagrid";
import { ExampleService } from "services";
import { errorDialog } from "@core/components/dialogs/errorDialog";
import { setMetaDataByPath } from "@core/stores/usePageTabStore";
import { subscribeWithSelector } from "zustand/middleware";
import shallow from "zustand/shallow";
import { PageStoreActions, StoreActions } from "@core/stores/types";
import { pageStoreActions } from "@core/stores/pageStoreActions";
import React from "react";
import { ROUTES } from "router/Routes";
import { pick } from "lodash";

interface ListRequest extends ExampleListRequest {}
interface SubListRequest {}

interface MetaData {
  listRequestValue: ListRequest;
  listColWidths: number[];
  listSortParams: AXFDGSortParam[];
  listSelectedRowKey?: React.Key;
  flexGrow: number;
  subListRequestValue: SubListRequest;
  subListColWidths: number[];
  subListSortParams: AXFDGSortParam[];
}

interface States extends MetaData {
  routePath: string; // initialized Store;
  listSpinning: boolean;
  listData: AXFDGDataItem<ExampleItem>[];
  listPage: AXFDGPage;
  subListSpinning: boolean;
  subListData: AXFDGDataItem<ExampleItem>[];
  subListPage: AXFDGPage;
}

interface Actions extends PageStoreActions<States> {
  setListRequestValue: (requestValue: ListRequest) => void;
  setListColWidths: (colWidths: number[]) => void;
  setListSpinning: (spinning: boolean) => void;
  setListSortParams: (sortParams: AXFDGSortParam[]) => void;
  setListSelectedRowKey: (key?: React.Key) => void;
  callListApi: (request?: ListRequest) => Promise<void>;
  changeListPage: (currentPage: number, pageSize?: number) => Promise<void>;
  setFlexGrow: (flexGlow: number) => void;

  setSubListRequestValue: (requestValue: ListRequest) => void;
  setSubListColWidths: (colWidths: number[]) => void;
  setSubListSpinning: (spinning: boolean) => void;
  setSubListSortParams: (sortParams: AXFDGSortParam[]) => void;
  callSubListApi: (request?: ListRequest) => Promise<void>;
  changeSubListPage: (currentPage: number, pageSize?: number) => Promise<void>;
}

// create states
const createState: States = {
  routePath: ROUTES.EXAMPLES.children.LIST_WITH_LIST.path,
  listRequestValue: {
    pageNumber: 1,
    pageSize: 100,
  },
  listColWidths: [],
  listSpinning: false,
  listData: [],
  listPage: {
    currentPage: 0,
    totalPages: 0,
  },
  listSortParams: [],
  listSelectedRowKey: "",
  flexGrow: 1,
  subListRequestValue: { pageNumber: 1, pageSize: 100 },
  subListColWidths: [],
  subListSpinning: false,
  subListData: [],
  subListPage: {
    currentPage: 0,
    totalPages: 0,
  },
  subListSortParams: [],
};

// create actions
const createActions: StoreActions<States & Actions, Actions> = (set, get) => ({
  setListRequestValue: (requestValues) => {
    set({ listRequestValue: requestValues });
  },
  setListColWidths: (colWidths) => set({ listColWidths: colWidths }),
  setListSpinning: (spinning) => set({ listSpinning: spinning }),
  setListSortParams: (sortParams) => set({ listSortParams: sortParams }),
  setListSelectedRowKey: (key) => {
    set({ listSelectedRowKey: key, subListRequestValue: { ...get().subListRequestValue, pid: key } });
  },
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
    const requestValues = {
      ...get().listRequestValue,
      pageNumber,
      pageSize,
    };
    set({ listRequestValue: requestValues });
    await get().callListApi();
  },
  setFlexGrow: (flexGlow) => {
    set({ flexGrow: flexGlow });
  },

  setSubListRequestValue: (requestValues) => {
    set({ subListRequestValue: requestValues });
  },
  setSubListColWidths: (colWidths) => set({ subListColWidths: colWidths }),
  setSubListSpinning: (spinning) => set({ subListSpinning: spinning }),
  setSubListSortParams: (sortParams) => set({ subListSortParams: sortParams }),
  callSubListApi: async (request) => {
    await set({ subListSpinning: true });

    try {
      const apiParam = request ?? get().subListRequestValue;
      const response = await ExampleService.subList(apiParam);

      set({
        subListData: response.ds.map((values) => ({
          values,
        })),
        subListPage: {
          currentPage: response.rs.pageNumber ?? 1,
          pageSize: response.rs.pageSize ?? 0,
          totalPages: response.rs.pgCount ?? 0,
          totalElements: response.ds.length,
        },
      });
    } catch (e) {
      await errorDialog(e as any);
    } finally {
      await set({ subListSpinning: false });
    }
  },
  changeSubListPage: async (pageNumber, pageSize) => {
    const requestValues = {
      ...get().subListRequestValue,
      pageNumber,
      pageSize,
    };
    set({ subListRequestValue: requestValues });
    await get().callSubListApi();
  },

  syncMetadata: (metaData) => {
    const metaDataKeys: (keyof MetaData)[] = [
      "listSortParams",
      "listRequestValue",
      "listColWidths",
      "flexGrow",
      "listSelectedRowKey",
      "subListSortParams",
      "subListColWidths",
    ];
    if (metaData) {
      console.log(`apply metaData Store : useExampleListStore`);
      set(pick(metaData, metaDataKeys));
    } else {
      console.log(`clear metaData Store : useExampleListStore`);
      set(pick(createState, metaDataKeys));
      set({
        subListData: [],
        subListPage: createState.subListPage,
      });
    }
  },

  ...pageStoreActions(set, get, () => unSubscribeExampleListWithListStore()),
});

// ---------------- exports
export interface ExampleListWithListStore extends States, Actions, PageStoreActions<States> {}
export const useExampleListWithListStore = create(
  subscribeWithSelector<ExampleListWithListStore>((set, get) => ({
    ...createState,
    ...createActions(set, get),
  }))
);

// pageModel 에 저장할 대상 모델 셀렉터 정의
export const unSubscribeExampleListWithListStore = useExampleListWithListStore.subscribe(
  (s) => [
    s.listSortParams,
    s.listRequestValue,
    s.listColWidths,
    s.flexGrow,
    s.subListSortParams,
    s.subListRequestValue,
    s.subListColWidths,
    s.listSelectedRowKey,
  ],
  ([
    listSortParams,
    listRequestValue,
    listColWidths,
    flexGrow,
    subListSortParams,
    subListRequestValue,
    subListColWidths,
    listSelectedRowKey,
  ]) => {
    console.log(`Save metaData '${createState.routePath}', Store : useExampleListWithListStore`);

    setMetaDataByPath<MetaData>(createState.routePath, {
      listSortParams,
      listRequestValue,
      listColWidths,
      flexGrow,
      subListSortParams,
      subListRequestValue,
      subListColWidths,
      listSelectedRowKey,
    });
  },
  { equalityFn: shallow }
);

useExampleListWithListStore.subscribe(
  (s) => [s.listSelectedRowKey],
  ([listSelectedRowKey]) => {
    if (listSelectedRowKey) {
      useExampleListWithListStore.getState().callSubListApi();
    } else {
      // clear
    }
  },
  { equalityFn: shallow }
);
