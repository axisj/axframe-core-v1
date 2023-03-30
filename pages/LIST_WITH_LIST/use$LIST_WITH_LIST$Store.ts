import create from "zustand";
import { ExampleItem, ExampleListRequest, ExampleSubItem } from "@core/services/example/ExampleRepositoryInterface";
import { AXFDGDataItem, AXFDGDataItemStatus, AXFDGPage, AXFDGSortParam } from "@axframe/datagrid";
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
import { addDataGridList, delDataGridList } from "@core/utils/array";
import { ProgramFn } from "@types";

interface ListRequest extends ExampleListRequest {}
interface DtoItem extends ExampleItem {}
interface SubDtoItem extends ExampleSubItem {}

interface MetaData {
  programFn?: ProgramFn;
  requestValue: ListRequest;
  listColWidths: number[];
  listSortParams: AXFDGSortParam[];
  listSelectedRowKey?: React.Key;
  flexGrow: number;
  childListColWidths: number[];
  childListSelectedRowKey?: React.Key;
  childListCheckedIndexes?: number[];
  childListData: AXFDGDataItem<SubDtoItem>[];
}

interface States extends MetaData {
  routePath: string; // initialized Store;
  spinning: boolean;
  listData: AXFDGDataItem<DtoItem>[];
  listPage: AXFDGPage;
}

interface Actions extends PageStoreActions<States> {
  callListApi: (request?: ListRequest) => Promise<void>;
  changeListPage: (currentPage: number, pageSize?: number) => Promise<void>;
  callSaveApi: () => Promise<void>;
  setSpinning: (spinning: boolean) => void;

  setRequestValue: (requestValue: ListRequest) => void;
  setListColWidths: (colWidths: number[]) => void;
  setListSortParams: (sortParams: AXFDGSortParam[]) => void;
  setListSelectedRowKey: (key: React.Key, detail: DtoItem) => void;
  setFlexGrow: (flexGlow: number) => void;

  setChildListColWidths: (colWidths: number[]) => void;
  setChildListSelectedRowKey: (key?: React.Key) => void;
  setChildListCheckedIndexes: (indexes?: number[]) => void;

  addChildListData: (list: SubDtoItem[]) => void;
  delChildListData: (indexes: number[]) => void;
  setChildListData: (list: AXFDGDataItem<SubDtoItem>[], reset?: boolean) => void;
}

// create states
const createState: States = {
  routePath: ROUTES.EXAMPLES.children.LIST_WITH_LIST.path,
  requestValue: {
    pageNumber: 1,
    pageSize: 100,
  },
  listColWidths: [],
  listSortParams: [],
  listSelectedRowKey: undefined,
  flexGrow: 1,

  spinning: false,
  listData: [],
  listPage: {
    currentPage: 0,
    totalPages: 0,
  },

  childListColWidths: [],
  childListSelectedRowKey: undefined,
  childListCheckedIndexes: [],
  childListData: [],
};

// create actions
const createActions: StoreActions<States & Actions, Actions> = (set, get) => ({
  callListApi: async (request) => {
    await set({ spinning: true });

    try {
      const apiParam = request ?? get().requestValue;
      const response = await ExampleService.list(apiParam);

      set({
        listData: response.ds.map((values) => ({
          values,
        })),
        listPage: {
          currentPage: response.page.pageNumber ?? 1,
          pageSize: response.page.pageSize ?? 0,
          totalPages: response.page.pageCount ?? 0,
          totalElements: response.page?.totalCount,
        },
      });
    } catch (e) {
      await errorDialog(e as any);
    } finally {
      await set({ spinning: false });
    }
  },
  changeListPage: async (pageNumber, pageSize) => {
    const requestValues = {
      ...get().requestValue,
      pageNumber,
      pageSize,
    };
    set({ requestValue: requestValues });
    await get().callListApi();
  },
  callSaveApi: async () => {
    await set({ spinning: true });

    const listDataCollector = (item) => {
      const ITEM_STAT = {
        [AXFDGDataItemStatus.new]: "C",
        [AXFDGDataItemStatus.edit]: "U",
        [AXFDGDataItemStatus.remove]: "D",
      };
      return { ...item.values, status: ITEM_STAT[item.status ?? AXFDGDataItemStatus.edit] };
    };

    try {
      await ExampleService.childListSave({
        list: get().childListData.map(listDataCollector),
      });
      await get().callListApi();

      // 저장된 새로운 데이터를 받는 과정 연결 필요. 샘플에서는 childListData 를 다시 초기화 하는 것을 예시로 보여줌
      set({
        childListData: get().childListData.map((item) => ({
          values: item.values,
        })),
      });
    } catch (e) {
      await errorDialog(e as any);
    } finally {
      await set({ spinning: false });
    }
  },
  setSpinning: (spinning) => set({ spinning }),
  setRequestValue: (requestValues) => set({ requestValue: requestValues }),
  setListColWidths: (colWidths) => set({ listColWidths: colWidths }),
  setListSortParams: (sortParams) => set({ listSortParams: sortParams }),
  setListSelectedRowKey: (key, detail) => {
    const childListData =
      detail.subList?.map((values) => ({
        values,
      })) ?? [];

    set({ listSelectedRowKey: key, childListData, childListSelectedRowKey: "", childListCheckedIndexes: [] });
  },
  setFlexGrow: (flexGlow) => set({ flexGrow: flexGlow }),

  setChildListColWidths: (colWidths) => set({ childListColWidths: colWidths }),
  setChildListSelectedRowKey: (key) => set({ childListSelectedRowKey: key }),
  setChildListCheckedIndexes: (indexes) => set({ childListCheckedIndexes: indexes }),
  addChildListData: (list) => {
    const listAData = addDataGridList<SubDtoItem>(get().childListData ?? [], list);
    set({ childListData: [...listAData] });
  },
  delChildListData: (indexes) => {
    const listData = delDataGridList(get().childListData ?? [], indexes);
    set({ childListData: [...listData], childListCheckedIndexes: [] });
  },
  setChildListData: (list, reset) => {
    if (reset) {
      set({
        childListCheckedIndexes: [],
        childListSelectedRowKey: undefined,
        childListData: list,
      });
    } else {
      set({ childListData: list });
    }
  },

  syncMetadata: (metaData) => {
    const metaDataKeys: (keyof MetaData)[] = [
      "programFn",
      "requestValue",
      "listColWidths",
      "listSortParams",
      "listSelectedRowKey",
      "flexGrow",
      "childListColWidths",
      "childListSelectedRowKey",
      "childListCheckedIndexes",
      "childListData",
    ];
    set(pick(metaData ?? createState, metaDataKeys));
  },

  ...pageStoreActions(set, get, { createState }),
});

// ---------------- exports
export interface $LIST_WITH_LIST$Store extends States, Actions, PageStoreActions<States> {}
export const use$LIST_WITH_LIST$Store = create(
  subscribeWithSelector<$LIST_WITH_LIST$Store>((set, get) => ({
    ...createState,
    ...createActions(set, get),
  }))
);

// pageModel 에 저장할 대상 모델 셀렉터 정의
use$LIST_WITH_LIST$Store.subscribe(
  (s) => [
    s.programFn,
    s.requestValue,
    s.listColWidths,
    s.listSortParams,
    s.listSelectedRowKey,
    s.flexGrow,
    s.childListColWidths,
    s.childListSelectedRowKey,
    s.childListCheckedIndexes,
    s.childListData,
  ],
  ([
    programFn,
    requestValue,
    listColWidths,
    listSortParams,
    listSelectedRowKey,
    flexGrow,
    childListColWidths,
    childListSelectedRowKey,
    childListCheckedIndexes,
    childListData,
  ]) => {
    setMetaDataByPath<MetaData>(createState.routePath, {
      programFn,
      requestValue,
      listColWidths,
      listSortParams,
      listSelectedRowKey,
      flexGrow,
      childListColWidths,
      childListSelectedRowKey,
      childListCheckedIndexes,
      childListData,
    });
  },
  { equalityFn: shallow }
);
