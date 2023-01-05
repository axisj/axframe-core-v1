import create from "zustand";
import { ExampleSaveRequest } from "@core/services/example/ExampleRepositoryInterface";
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

interface MetaData {
  saveRequestValue: SaveRequest;
}

interface States extends MetaData {
  routePath: string; // initialized Store;
  saveSpinning: boolean;
}

interface Actions extends PageStoreActions<States> {
  setSaveRequestValue: (exampleSaveRequestValue: SaveRequest) => void;
  setSaveSpinning: (exampleSaveSpinning: boolean) => void;
  callSaveApi: (request?: SaveRequest) => Promise<void>;
}

// create states
const createState: States = {
  routePath: ROUTES.EXAMPLES.children.LIST_DETAIL.children.REGISTRATION.path,
  saveRequestValue: {},
  saveSpinning: false,
};

// create actions
const createActions: StoreActions<States & Actions, Actions> = (set, get) => ({
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
      console.log(`apply metaData Store : useExampleFormStore`);
      set({
        saveRequestValue: metaData.saveRequestValue,
      });
    } else {
      console.log(`clear metaData Store : useExampleFormStore`);
      const metaDataKeys: (keyof MetaData)[] = ["saveRequestValue"];
      set(pick(createState, metaDataKeys));
    }
  },
  ...pageStoreActions(set, get, () => unSubscribeExampleFormStore()),
});

// ---------------- exports
export interface ExampleFormStore extends States, Actions, PageStoreActions<States> {}
export const useExampleFormStore = create(
  subscribeWithSelector<ExampleFormStore>((set, get) => ({
    ...createState,
    ...createActions(set, get),
  }))
);

export const unSubscribeExampleFormStore = useExampleFormStore.subscribe(
  (s) => [s.saveRequestValue],
  ([saveRequestValue]) => {
    console.log(`Save metaData '${createState.routePath}', Store : useExampleFormStore`);

    setMetaDataByPath<MetaData>(createState.routePath, {
      saveRequestValue: saveRequestValue,
    });
  },
  { equalityFn: shallow }
);
