import { Currency, LangCode, Unit } from "@hackathemy-qrmenu/type";
import { create } from "zustand";

interface SettingStore {
  currency: Currency;
  langCode: LangCode;
  unit: Unit;

  setCurrency: (currency: Currency) => void;
  setLangCode: (langCode: LangCode) => void;
  setUnit: (unit: Unit) => void;
}

export const useSettingStore = create<SettingStore>()((set) => ({
  currency: Currency.USD,
  langCode: LangCode.EN,
  unit: Unit.Imperial,

  setCurrency: (currency: Currency) => set({ currency }),
  setLangCode: (langCode: LangCode) => set({ langCode }),
  setUnit: (unit: Unit) => set({ unit }),
}));
