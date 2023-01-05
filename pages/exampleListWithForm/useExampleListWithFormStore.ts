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

interface ListRequest extends ExampleListRequest {}
interface SaveRequest {}

interface MetaData {
  listRequestValue: ListRequest;
  listColWidths: number[];
  listSortParams: AXFDGSortParam[];
  listSelectedRowKey?: React.Key;
  flexGrow: number;
  saveRequestValue: SaveRequest;
}

interface States extends MetaData {
  routePath?: string; // initialized Store;
  listSpinning: boolean;
  listData: AXFDGDataItem<ExampleItem>[];
  listPage: AXFDGPage;
  saveSpinning: boolean;
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

  setSaveRequestValue: (exampleSaveRequestValue: SaveRequest) => void;
  setSaveSpinning: (exampleSaveSpinning: boolean) => void;
  callSaveApi: (request?: SaveRequest) => Promise<void>;
}

// create states
const routePath = ROUTES.EXAMPLES.children.LIST_WITH_FORM.path;
const _listRequestValue = {
  pageNumber: 1,
  pageSize: 100,
};
const _formRequestValue = {};
const createState: States = {
  routePath,
  listRequestValue: { ..._listRequestValue },
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
  saveRequestValue: { ..._formRequestValue },
  saveSpinning: false,
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
    set({ listSelectedRowKey: key });
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
  setSaveRequestValue: (exampleSaveRequestValue) => {
    set({ saveRequestValue: exampleSaveRequestValue });
  },
  setSaveSpinning: (exampleSaveSpinning) => set({ saveSpinning: exampleSaveSpinning }),
  callSaveApi: async (request) => {
    await set({ saveSpinning: true });

    try {
      const apiParam = request ?? get().saveRequestValue;
      const response = await ExampleService.save(apiParam);

      console.log(response);
    } catch (e) {
      await errorDialog(e as any);
    } finally {
      await set({ saveSpinning: false });
    }
  },

  syncMetadata: (metaData) => {
    if (metaData) {
      console.log(`apply metaData Store : useExampleListStore`);
      set({
        listSortParams: metaData.listSortParams,
        listRequestValue: metaData.listRequestValue,
        listColWidths: metaData.listColWidths,
        flexGrow: metaData.flexGrow,
        saveRequestValue: metaData.saveRequestValue,
      });
    } else {
      console.log(`clear metaData Store : useExampleListStore`);
      set({
        listRequestValue: _listRequestValue,
        flexGrow: 1,
        listSelectedRowKey: "",
        saveRequestValue: undefined,
      });
    }
  },

  ...pageStoreActions(set, get, () => unSubscribeExampleListWithFormStore()),
});

// ---------------- exports
export interface ExampleListWithListStore extends States, Actions, PageStoreActions<States> {}
export const useExampleListWithFormStore = create(
  subscribeWithSelector<ExampleListWithListStore>((set, get) => ({
    ...createState,
    ...createActions(set, get),
  }))
);

// pageModel 에 저장할 대상 모델 셀렉터 정의
export const unSubscribeExampleListWithFormStore = useExampleListWithFormStore.subscribe(
  (s) => [s.listSortParams, s.listRequestValue, s.listColWidths, s.listSelectedRowKey, s.flexGrow, s.saveRequestValue],
  ([listSortParams, listRequestValue, listColWidths, listSelectedRowKey, flexGrow, saveRequestValue]) => {
    console.log(`Save metaData '${routePath}', Store : useExampleListWithListStore`);

    setMetaDataByPath<MetaData>(routePath, {
      listSortParams,
      listRequestValue,
      listColWidths,
      listSelectedRowKey,
      flexGrow,
      saveRequestValue,
    });
  },
  { equalityFn: shallow }
);

useExampleListWithFormStore.subscribe(
  (s) => [s.listSelectedRowKey],
  ([listSelectedRowKey]) => {
    if (listSelectedRowKey) {
      // useExampleListWithFormStore.getState().callSubListApi();
    } else {
      // clear
    }
  },
  { equalityFn: shallow }
);
