import create from "zustand";
import { ExampleListRequest, ExampleSubItem } from "@core/services/example/ExampleRepositoryInterface";
import { AXFDGDataItem, AXFDGDataItemStatus } from "@axframe/datagrid";
import { setMetaDataByPath } from "@core/stores/usePageTabStore";
import { subscribeWithSelector } from "zustand/middleware";
import shallow from "zustand/shallow";
import { PageStoreActions, StoreActions } from "@core/stores/types";
import { pageStoreActions } from "@core/stores/pageStoreActions";
import React from "react";
import { ROUTES } from "router/Routes";
import { pick } from "lodash";
import { ExampleService } from "services";
import { errorDialog } from "@core/components/dialogs";
import { addDataGridList, delDataGridList } from "@core/utils/array";

interface Request extends ExampleListRequest {}

interface DtoItem extends ExampleSubItem {}

interface MetaData {
  requestValue: Request;

  listAColWidths: number[];
  listASelectedRowKey?: React.Key;
  listACheckedIndexes?: number[];

  listBColWidths: number[];
  listBSelectedRowKey?: React.Key;
  listBCheckedIndexes?: number[];

  listCColWidths: number[];
  listCSelectedRowKey?: React.Key;
  listCCheckedIndexes?: number[];
}

interface States extends MetaData {
  routePath: string; // initialized Store;
  spinning: boolean;

  listAData: AXFDGDataItem<DtoItem>[];
  listBData: AXFDGDataItem<DtoItem>[];
  listCData: AXFDGDataItem<DtoItem>[];
}

interface Actions extends PageStoreActions<States> {
  setRequestValue: (requestValue: Request) => void;
  callListApi: (request?: Request) => Promise<void>;
  callSaveApi: () => Promise<void>;
  setSpinning: (spinning: boolean) => void;

  setListAColWidths: (colWidths: number[]) => void;
  setListASelectedRowKey: (key?: React.Key) => void;
  setListACheckedIndexes: (indexes?: number[]) => void;
  setListBColWidths: (colWidths: number[]) => void;
  setListBSelectedRowKey: (key?: React.Key) => void;
  setListBCheckedIndexes: (indexes?: number[]) => void;
  setListCColWidths: (colWidths: number[]) => void;
  setListCSelectedRowKey: (key?: React.Key) => void;
  setListCCheckedIndexes: (indexes?: number[]) => void;

  addListAData: (list: DtoItem[]) => void;
  delListAData: (indexes: number[]) => void;
  setListAData: (list: AXFDGDataItem<DtoItem>[], reset?: boolean) => void;
  addListBData: (list: DtoItem[]) => void;
  delListBData: (indexes: number[]) => void;
  setListBData: (list: AXFDGDataItem<DtoItem>[], reset?: boolean) => void;
  addListCData: (list: DtoItem[]) => void;
  delListCData: (indexes: number[]) => void;
  setListCData: (list: AXFDGDataItem<DtoItem>[], reset?: boolean) => void;
}

// create states
const createState: States = {
  routePath: ROUTES.EXAMPLES.children.THREE_LIST.path,
  requestValue: {},
  spinning: false,

  listAColWidths: [],
  listASelectedRowKey: "",
  listACheckedIndexes: [],
  listAData: [],
  listBColWidths: [],
  listBSelectedRowKey: "",
  listBCheckedIndexes: [],
  listBData: [],
  listCColWidths: [],
  listCSelectedRowKey: "",
  listCCheckedIndexes: [],
  listCData: [],
};

// create actions
const createActions: StoreActions<States & Actions, Actions> = (set, get) => ({
  setRequestValue: (requestValue) => {
    set({ requestValue: requestValue });
  },
  setSpinning: (spinning) => {
    set({ spinning: spinning });
  },
  callListApi: async () => {
    await set({ spinning: true });

    try {
      const apiParam = get().requestValue;
      const response = await ExampleService.childList(apiParam);

      set({
        listAData: response.ds.map((values) => ({
          values,
        })),
        listBData: response.ds.map((values) => ({
          values,
        })),
        listCData: response.ds.map((values) => ({
          values,
        })),
      });
    } catch (e) {
      await errorDialog(e as any);
    } finally {
      await set({ spinning: false });
    }
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
        list: get().listAData.map(listDataCollector),
      });
      await ExampleService.childListSave({
        list: get().listBData.map(listDataCollector),
      });
      await ExampleService.childListSave({
        list: get().listCData.map(listDataCollector),
      });
    } catch (e) {
      await errorDialog(e as any);
    } finally {
      await set({ spinning: false });
    }
  },

  setListAColWidths: (colWidths) => {
    set({ listAColWidths: colWidths });
  },
  setListASelectedRowKey: (key) => {
    set({ listASelectedRowKey: key });
  },
  setListACheckedIndexes: (indexes) => {
    set({ listACheckedIndexes: indexes });
  },
  setListBColWidths: (colWidths) => {
    set({ listBColWidths: colWidths });
  },
  setListBSelectedRowKey: (key) => {
    set({ listBSelectedRowKey: key });
  },
  setListBCheckedIndexes: (indexes) => {
    set({ listBCheckedIndexes: indexes });
  },
  setListCColWidths: (colWidths) => {
    set({ listCColWidths: colWidths });
  },
  setListCSelectedRowKey: (key) => {
    set({ listCSelectedRowKey: key });
  },
  setListCCheckedIndexes: (indexes) => {
    set({ listCCheckedIndexes: indexes });
  },

  addListAData: (list) => {
    const listData = addDataGridList<DtoItem>(get().listAData ?? [], list);
    set({ listAData: [...listData] });
  },
  delListAData: (indexes) => {
    const listData = delDataGridList(get().listAData ?? [], indexes);
    set({ listAData: [...listData], listACheckedIndexes: [] });
  },
  setListAData: (list, reset) => {
    if (reset) {
      set({
        listACheckedIndexes: [],
        listASelectedRowKey: undefined,
        listAData: list,
      });
    } else {
      set({ listAData: list });
    }
  },
  addListBData: (list) => {
    const listData = addDataGridList<DtoItem>(get().listBData ?? [], list);
    set({ listBData: [...listData] });
  },
  delListBData: (indexes) => {
    const listData = delDataGridList(get().listBData ?? [], indexes);
    set({ listBData: [...listData], listBCheckedIndexes: [] });
  },
  setListBData: (list, reset) => {
    if (reset) {
      set({
        listBCheckedIndexes: [],
        listBSelectedRowKey: undefined,
        listBData: list,
      });
    } else {
      set({ listBData: list });
    }
  },
  addListCData: (list) => {
    const listData = addDataGridList<DtoItem>(get().listCData ?? [], list);
    set({ listCData: [...listData] });
  },
  delListCData: (indexes) => {
    const listData = delDataGridList(get().listCData ?? [], indexes);
    set({ listCData: [...listData], listCCheckedIndexes: [] });
  },
  setListCData: (list, reset) => {
    if (reset) {
      set({
        listCCheckedIndexes: [],
        listCSelectedRowKey: undefined,
        listCData: list,
      });
    } else {
      set({ listCData: list });
    }
  },

  syncMetadata: (metaData) => {
    const metaDataKeys: (keyof MetaData)[] = [
      "requestValue",
      "listAColWidths",
      "listASelectedRowKey",
      "listACheckedIndexes",
      "listBColWidths",
      "listBSelectedRowKey",
      "listBCheckedIndexes",
      "listCColWidths",
      "listCSelectedRowKey",
      "listCCheckedIndexes",
    ];
    set(pick(metaData ?? createState, metaDataKeys));
  },

  ...pageStoreActions(set, get),
});

// ---------------- exports
export interface $LIST_WITH_LIST$Store extends States, Actions, PageStoreActions<States> {}
export const use$THREE_LIST$Store = create(
  subscribeWithSelector<$LIST_WITH_LIST$Store>((set, get) => ({
    ...createState,
    ...createActions(set, get),
  }))
);

// pageModel 에 저장할 대상 모델 셀렉터 정의
use$THREE_LIST$Store.subscribe(
  (s) => [
    s.requestValue,
    s.listAColWidths,
    s.listASelectedRowKey,
    s.listACheckedIndexes,
    s.listBColWidths,
    s.listBSelectedRowKey,
    s.listBCheckedIndexes,
    s.listCColWidths,
    s.listCSelectedRowKey,
    s.listCCheckedIndexes,
  ],
  ([
    requestValue,
    listAColWidths,
    listASelectedRowKey,
    listACheckedIndexes,
    listBColWidths,
    listBSelectedRowKey,
    listBCheckedIndexes,
    listCColWidths,
    listCSelectedRowKey,
    listCCheckedIndexes,
  ]) => {
    setMetaDataByPath<MetaData>(createState.routePath, {
      requestValue,
      listAColWidths,
      listASelectedRowKey,
      listACheckedIndexes,
      listBColWidths,
      listBSelectedRowKey,
      listBCheckedIndexes,
      listCColWidths,
      listCSelectedRowKey,
      listCCheckedIndexes,
    });
  },
  { equalityFn: shallow }
);
