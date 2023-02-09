import create from "zustand";
import {
  ExampleDetailRequest,
  ExampleItem,
  ExampleSaveRequest,
} from "@core/services/example/ExampleRepositoryInterface";
import { ExampleService } from "services";
import { errorDialog } from "@core/components/dialogs/errorDialog";
import { setMetaDataByPath } from "@core/stores/usePageTabStore";
import { subscribeWithSelector } from "zustand/middleware";
import shallow from "zustand/shallow";
import { PageStoreActions, StoreActions } from "@core/stores/types";
import { pageStoreActions } from "@core/stores/pageStoreActions";
import { ROUTES } from "router/Routes";
import { pick } from "lodash";

interface SaveRequest extends ExampleSaveRequest {}
interface APIDetailRequest extends ExampleDetailRequest {}
interface DtoItem extends ExampleItem {}

interface MetaData {
  saveRequestValue: SaveRequest;
}

interface States extends MetaData {
  routePath: string; // initialized Store;
  detailSpinning: boolean;
  detail?: DtoItem;
}

interface Actions extends PageStoreActions<States> {
  setDetailRequestValue: (exampleSaveRequestValue: SaveRequest) => void;
  setDetailSpinning: (exampleSaveSpinning: boolean) => void;
  callDetailApi: (request?: APIDetailRequest) => Promise<void>;
}

// create states
const createState: States = {
  routePath: ROUTES.EXAMPLES.children.LIST_DETAIL.children.DETAIL.path,
  saveRequestValue: {},
  detailSpinning: false,
};

// create actions
const createActions: StoreActions<States & Actions, Actions> = (set, get) => ({
  setDetailRequestValue: (requestValue) => {
    set({ saveRequestValue: requestValue });
  },
  setDetailSpinning: (spinning) => set({ detailSpinning: spinning }),
  callDetailApi: async (request) => {
    await set({ detailSpinning: true });

    try {
      const apiParam = request ?? get().saveRequestValue;
      const response = await ExampleService.detail(apiParam);

      console.log(response);

      set({ detail: response.rs });
    } catch (e) {
      await errorDialog(e as any);
    } finally {
      await set({ detailSpinning: false });
    }
  },
  syncMetadata: (metaData) => {
    const metaDataKeys: (keyof MetaData)[] = ["saveRequestValue"];
    set(pick(metaData ?? createState, metaDataKeys));
  },

  ...pageStoreActions(set, get),
});

// ---------------- exports
export interface $DETAIL$Store extends States, Actions, PageStoreActions<States> {}
export const use$DETAIL$Store = create(
  subscribeWithSelector<$DETAIL$Store>((set, get) => ({
    ...createState,
    ...createActions(set, get),
  }))
);

use$DETAIL$Store.subscribe(
  (s) => [s.saveRequestValue],
  ([saveRequestValue]) => {
    setMetaDataByPath<MetaData>(createState.routePath, {
      saveRequestValue: saveRequestValue,
    });
  },
  { equalityFn: shallow }
);
