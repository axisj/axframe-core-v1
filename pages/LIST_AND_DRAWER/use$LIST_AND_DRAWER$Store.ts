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
import { ROUTES } from "router/Routes";
import { pick } from "lodash";
import { ProgramFn } from "@types";

interface ListRequest extends ExampleListRequest {}

interface DetailRequest extends ExampleListRequest {}

interface DtoItem extends ExampleItem {}

interface MetaData {
  programFn?: ProgramFn;
  listRequestValue: ListRequest;
  listColWidths: number[];
  listSortParams: AXFDGSortParam[];
}

interface States extends MetaData {
  routePath: string; // initialized Store;
  listSpinning: boolean;
  listData: AXFDGDataItem<DtoItem>[];
  listPage: AXFDGPage;
  detailSpinning: boolean;
  detail?: DtoItem;
}

interface Actions extends PageStoreActions<States> {
  setListRequestValue: (requestValue: ListRequest) => void;
  setListColWidths: (colWidths: number[]) => void;
  setListSpinning: (spinning: boolean) => void;
  setListSortParams: (sortParams: AXFDGSortParam[]) => void;
  callListApi: (request?: ListRequest, pageNumber?: number) => Promise<void>;
  changeListPage: (currentPage: number, pageSize?: number) => Promise<void>;
  setDetailSpinning: (detailSpinning: boolean) => void;
  callDetailApi: (request?: DetailRequest) => Promise<void>;
}

// create states
const createState: States = {
  routePath: ROUTES.EXAMPLES.children.LIST_AND_DRAWER.path,
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
  detailSpinning: false,
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
  callListApi: async (request, pageNumber = 1) => {
    if (get().listSpinning) return;
    await set({ listSpinning: true });

    try {
      const requestValue = request ?? get().listRequestValue;
      const apiParam: ListRequest = {
        ...requestValue,
        pageNumber,
      };
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
      throw e;
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
    await get().callListApi(undefined, pageNumber);
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
    const metaDataKeys: (keyof MetaData)[] = ["programFn", "listSortParams", "listRequestValue", "listColWidths"];
    set(pick(metaData ?? createState, metaDataKeys));
  },

  ...pageStoreActions(set, get, { createState }),
});

// ---------------- exports
export interface $LIST_AND_DRAWER$Store extends States, Actions, PageStoreActions<States> {}

export const use$LIST_AND_DRAWER$Store = create(
  subscribeWithSelector<$LIST_AND_DRAWER$Store>((set, get) => ({
    ...createState,
    ...createActions(set, get),
  }))
);

use$LIST_AND_DRAWER$Store.subscribe(
  (s) => [s.programFn, s.listSortParams, s.listRequestValue, s.listColWidths],
  ([programFn, listSortParams, listRequestValue, listColWidths]) => {
    setMetaDataByPath<MetaData>(createState.routePath, {
      programFn,
      listSortParams,
      listRequestValue,
      listColWidths,
    });
  },
  { equalityFn: shallow }
);
