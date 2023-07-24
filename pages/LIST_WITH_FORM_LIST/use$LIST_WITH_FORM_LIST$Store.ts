import { create } from "zustand";
import {
  ExampleItem,
  ExampleListRequest,
  ExampleSaveRequest,
  ExampleSubItem,
} from "@core/services/example/ExampleRepositoryInterface";
import { AXFDGDataItem, AXFDGDataItemStatus, AXFDGPage, AXFDGSortParam } from "@axframe/datagrid";
import { ExampleService } from "services";
import { setMetaDataByPath } from "@core/stores/usePageTabStore";
import { subscribeWithSelector } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { PageStoreActions, StoreActions } from "@core/stores/types";
import { pageStoreActions } from "@core/stores/pageStoreActions";
import React from "react";
import { ROUTES } from "router/Routes";
import { omit, pick } from "lodash";
import { convertDateToString } from "@core/utils/object";
import { addDataGridList, delDataGridList } from "@core/utils/array";
import { ProgramFn } from "@types";

interface ListRequest extends ExampleListRequest {}

interface SaveRequest extends ExampleSaveRequest {}

interface DtoItem extends ExampleItem {}

interface DtoSubItem extends ExampleSubItem {}

interface MetaData {
  programFn?: ProgramFn;
  listRequestValue: ListRequest;
  listColWidths: number[];
  listSortParams: AXFDGSortParam[];
  listSelectedRowKey?: React.Key;
  flexGrow: number;
  saveRequestValue: SaveRequest;
  detail?: SaveRequest;
  formActive: boolean;

  subListColWidths: number[];
  subListSelectedRowKey?: React.Key;
  subListCheckedIndexes?: number[];
  subListData: AXFDGDataItem<DtoSubItem>[];
}

interface States extends MetaData {
  routePath: string; // initialized Store;
  listSpinning: boolean;
  listData: AXFDGDataItem<DtoItem>[];
  listPage: AXFDGPage;
  saveSpinning: boolean;

  subListSpinning: boolean;
}

interface Actions extends PageStoreActions<States> {
  setListRequestValue: (requestValue: ListRequest) => void;
  setListColWidths: (colWidths: number[]) => void;
  setListSpinning: (spinning: boolean) => void;
  setListSortParams: (sortParams: AXFDGSortParam[]) => void;
  setListSelectedRowKey: (key?: React.Key, detail?: DtoItem) => void;
  callListApi: (request?: ListRequest) => Promise<void>;
  changeListPage: (currentPage: number, pageSize?: number) => Promise<void>;
  setFlexGrow: (flexGlow: number) => void;

  setSaveRequestValue: (exampleSaveRequestValue: SaveRequest) => void;
  setSaveSpinning: (exampleSaveSpinning: boolean) => void;
  callSaveApi: (request?: SaveRequest) => Promise<void>;
  cancelFormActive: () => void;
  setFormActive: () => void;

  setSubListColWidths: (colWidths: number[]) => void;
  setSubListSpinning: (spinning: boolean) => void;
  setSubListSelectedRowKey: (key?: React.Key) => void;
  setSubListCheckedIndexes: (indexes?: number[]) => void;
  addSubList: (list: DtoSubItem[]) => void;
  delSubList: (indexes: number[]) => void;
  setSubListData: (list: AXFDGDataItem<DtoSubItem>[], reset?: boolean) => void;
}

// create states
const createState: States = {
  routePath: ROUTES.EXAMPLES.children.LIST_WITH_FORM_LIST.path,
  listRequestValue: { pageNumber: 1, pageSize: 100 },
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
  saveRequestValue: {},
  detail: {},
  saveSpinning: false,
  formActive: false,

  subListColWidths: [],
  subListSpinning: false,
  subListData: [],
};

// create actions
const createActions: StoreActions<States & Actions, Actions> = (set, get) => ({
  onMountApp: async () => {},
  setListRequestValue: (requestValues) => {
    set({ listRequestValue: requestValues });
  },
  setListColWidths: (colWidths) => set({ listColWidths: colWidths }),
  setListSpinning: (spinning) => set({ listSpinning: spinning }),
  setListSortParams: (sortParams) => set({ listSortParams: sortParams }),
  setListSelectedRowKey: async (key, detail) => {
    const saveRequestValue = { ...omit(detail, ["subList"]) };
    const subListData =
      detail?.subList?.map((values) => ({
        values,
      })) ?? [];
    set({
      listSelectedRowKey: key,
      saveRequestValue,
      detail,
    });
    get().setSubListData(subListData, true);
  },
  callListApi: async (request) => {
    if (get().listSpinning) return;
    set({ listSpinning: true });

    try {
      const apiParam: ListRequest = {
        ...get().listRequestValue,
        ...request,
      };
      const response = await ExampleService.list(apiParam);

      set({
        listRequestValue: apiParam,
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
      throw e;
    } finally {
      await set({ listSpinning: false });
    }
  },
  changeListPage: async (pageNumber, pageSize) => {
    await get().callListApi({
      pageNumber,
      pageSize,
    });
  },
  setFlexGrow: (flexGlow) => {
    set({ flexGrow: flexGlow });
  },
  setSaveRequestValue: (exampleSaveRequestValue) => {
    set({ saveRequestValue: exampleSaveRequestValue });
  },
  setSaveSpinning: (exampleSaveSpinning) => set({ saveSpinning: exampleSaveSpinning }),
  callSaveApi: async (request) => {
    if (get().saveSpinning) return;
    await set({ saveSpinning: true });

    try {
      // subList 데이터를 어떻게 전송할지 체크 필요!!
      const apiParam = request ?? {
        ...get().saveRequestValue,
        subList: get().subListData.map((item) => {
          const ITEM_STAT = {
            [AXFDGDataItemStatus.new]: "C",
            [AXFDGDataItemStatus.edit]: "U",
            [AXFDGDataItemStatus.remove]: "D",
          };
          return { ...item.values, status: ITEM_STAT[item.status ?? AXFDGDataItemStatus.edit] };
        }),
        __status__: get().listSelectedRowKey ? "U" : "C",
      };

      await ExampleService.save(convertDateToString(apiParam));
    } catch (e) {
      throw e;
    } finally {
      await set({ saveSpinning: false });
    }
  },
  cancelFormActive: () => {
    set({
      formActive: false,
      listSelectedRowKey: undefined,
      subListCheckedIndexes: [],
      subListSelectedRowKey: undefined,
    });
  },
  setFormActive: () => {
    set({
      formActive: true,
      detail: undefined,
      saveRequestValue: {},
      subListData: [],
      subListCheckedIndexes: [],
      subListSelectedRowKey: undefined,
    });
  },

  setSubListColWidths: (colWidths) => set({ subListColWidths: colWidths }),
  setSubListSpinning: (spinning) => set({ subListSpinning: spinning }),
  setSubListSelectedRowKey: async (key) => {
    set({ subListSelectedRowKey: key });
  },
  setSubListCheckedIndexes: (indexes) => {
    set({ subListCheckedIndexes: indexes });
  },
  addSubList: (list) => {
    const listData = addDataGridList<DtoSubItem>(get().subListData ?? [], list);
    set({ subListData: [...listData] });
  },
  delSubList: (indexes) => {
    const listData = delDataGridList(get().subListData ?? [], indexes);
    set({ subListData: [...listData], subListCheckedIndexes: [] });
  },
  setSubListData: (list, reset) => {
    if (reset) {
      set({
        subListCheckedIndexes: [],
        subListSelectedRowKey: undefined,
        subListData: list,
      });
    } else {
      set({ subListData: list });
    }
  },

  syncMetadata: (metaData) => {
    const metaDataKeys: (keyof MetaData)[] = [
      "programFn",
      "listSortParams",
      "listRequestValue",
      "listColWidths",
      "listSelectedRowKey",
      "flexGrow",
      "saveRequestValue",
      "detail",
      "formActive",
      "subListCheckedIndexes",
      "subListSelectedRowKey",
      "subListColWidths",
      "subListData",
    ];
    set(pick(metaData ?? createState, metaDataKeys));
  },
  ...pageStoreActions(set, get, { createState }),
});

// ---------------- exports
export interface $LIST_WITH_FORM_LIST$Store extends States, Actions, PageStoreActions<States> {}

export const use$LIST_WITH_FORM_LIST$Store = create(
  subscribeWithSelector<$LIST_WITH_FORM_LIST$Store>((set, get) => ({
    ...createState,
    ...createActions(set, get),
  }))
);

// pageModel 에 저장할 대상 모델 셀렉터 정의
use$LIST_WITH_FORM_LIST$Store.subscribe(
  (s) => [
    s.programFn,
    s.listSortParams,
    s.listRequestValue,
    s.listColWidths,
    s.listSelectedRowKey,
    s.flexGrow,
    s.saveRequestValue,
    s.detail,
    s.formActive,
    s.subListCheckedIndexes,
    s.subListSelectedRowKey,
    s.subListColWidths,
    s.subListData,
  ],
  ([
    programFn,
    listSortParams,
    listRequestValue,
    listColWidths,
    listSelectedRowKey,
    flexGrow,
    saveRequestValue,
    detail,
    formActive,
    subListCheckedIndexes,
    subListSelectedRowKey,
    subListColWidths,
    subListData,
  ]) => {
    setMetaDataByPath<MetaData>(createState.routePath, {
      programFn,
      listSortParams,
      listRequestValue,
      listColWidths,
      listSelectedRowKey,
      flexGrow,
      saveRequestValue,
      detail,
      formActive,
      subListCheckedIndexes,
      subListSelectedRowKey,
      subListColWidths,
      subListData,
    });
  },
  { equalityFn: shallow }
);
