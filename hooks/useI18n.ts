import { useAppStore } from "stores";
import i18n from "i18n";
import koKR from "antd/es/locale/ko_KR";
import enUS from "antd/es/locale/en_US";

if (koKR.Calendar && koKR.DatePicker) {
  koKR.DatePicker.lang.shortMonths = koKR.Calendar.lang.shortMonths = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];
  koKR.DatePicker.lang.shortWeekDays = koKR.Calendar.lang.shortWeekDays = ["일", "월", "화", "수", "목", "금", "토"];
}

export function useI18n() {
  const currentLanguage = useAppStore((s) => s.currentLanguage);
  const setLanguage = useAppStore((s) => s.setLanguage);
  return {
    t: i18n[currentLanguage ?? "en"],
    currentLanguage,
    setLanguage,
    antdLocale: currentLanguage === "ko" ? koKR : enUS,
  };
}

export function getI18n() {
  const currentLanguage = useAppStore.getState().currentLanguage;
  return { t: i18n[currentLanguage ?? "en"], currentLanguage, antdLocale: currentLanguage === "ko" ? koKR : enUS };
}
