import { useAppStore } from "stores";
import i18n from "i18n";

export function useI18n() {
  const currentLanguage = useAppStore((s) => s.currentLanguage);
  const setLanguage = useAppStore((s) => s.setLanguage);
  return { t: i18n[currentLanguage ?? "en"], currentLanguage, setLanguage };
}

export function getI18n() {
  const currentLanguage = useAppStore.getState().currentLanguage;
  return { t: i18n[currentLanguage ?? "en"], currentLanguage };
}
