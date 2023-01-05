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

interface SaveRequest extends ExampleSaveRequest {}
interface APIDetailRequest extends ExampleDetailRequest {}

interface MetaData {
  saveRequestValue: SaveRequest;
}

interface States extends MetaData {
  routePath?: string; // initialized Store;
  detailSpinning: boolean;
  detail?: ExampleItem;
}

interface Actions extends PageStoreActions<States> {
  setDetailRequestValue: (exampleSaveRequestValue: SaveRequest) => void;
  setDetailSpinning: (exampleSaveSpinning: boolean) => void;
  callDetailApi: (request?: APIDetailRequest) => Promise<void>;
}

// create states
const routePath = ROUTES.EXAMPLES.children.LIST_DETAIL.children.DETAIL.path;
const _saveRequestValue = {};
const state: States = {
  routePath,
  saveRequestValue: { ..._saveRequestValue },
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
    console.log("metaData", metaData);
    if (metaData) {
      console.log(`apply metaData Store : useExampleFormStore`);
      set({
        saveRequestValue: metaData.saveRequestValue,
      });
    } else {
      console.log(`clear metaData Store : useExampleFormStore`);
      set({ saveRequestValue: undefined });
    }
  },
  ...pageStoreActions(set, get, () => unSubscribeExampleDetailStore()),
});

// ---------------- exports
export interface ExampleDetailStore extends States, Actions, PageStoreActions<States> {}
export const useExampleDetailStore = create(
  subscribeWithSelector<ExampleDetailStore>((set, get) => ({
    ...state,
    ...createActions(set, get),
  }))
);

export const unSubscribeExampleDetailStore = useExampleDetailStore.subscribe(
  (s) => [s.saveRequestValue],
  ([saveRequestValue]) => {
    console.log(`Save metaData '${routePath}', Store : useExampleDetailStore`);

    setMetaDataByPath<MetaData>(routePath, {
      saveRequestValue: saveRequestValue,
    });
  },
  { equalityFn: shallow }
);
