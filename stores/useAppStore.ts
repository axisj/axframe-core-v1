import buildStore from "@core/stores/buildStore";
import { StoreActions } from "@core/stores/types";
import { ThemeType } from "styles/theme";
import { LanguageType } from "i18n";

export interface AppModel {
  loaded: boolean;
  currentLanguage: LanguageType;
  theme: ThemeType;
  sideMenuOpened: boolean;
  width: number;
  height: number;
}

export interface AppActions {
  setLanguage: (language: LanguageType) => void;
  setTheme: (theme: ThemeType) => void;
  setLoaded: (loaded: boolean) => void;
  setSideMenuOpened: (sideMenuOpened: boolean) => void;
  setWidthHeight: (width: number, height: number) => void;
}

export interface AppStore extends AppModel, AppActions {}

export const appInitialState: AppModel = {
  loaded: false,
  currentLanguage: "ko",
  theme: "light",
  sideMenuOpened: true,
  width: 0,
  height: 0,
};

const getAppStoreActions: StoreActions<AppModel & AppActions, AppActions> = (set, get) => ({
  setLanguage: (language: LanguageType) => set({ currentLanguage: language }),
  setTheme: (theme: ThemeType) => set({ theme }),
  setLoaded: (loaded: boolean) => set({ loaded }),
  setSideMenuOpened: (sideMenuOpened: boolean) => set({ sideMenuOpened }),
  setWidthHeight: (width, height) => set({ width, height }),
});

export const useAppStore = buildStore<AppStore>("app", 1, (set, get) => ({
  ...appInitialState,
  ...getAppStoreActions(set, get),
}));

useAppStore.persist.onFinishHydration((state) => {
  if (!state.loaded) {
    state.setLoaded(true);
  }
});
