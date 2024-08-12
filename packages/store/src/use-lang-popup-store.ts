import { create } from "zustand";

interface LangPopupStore {
  open: boolean;
  callback:
    | undefined
    | ((withTranslate: boolean, onSettled: () => void) => void);
  show: (
    cb: (withTranslate: boolean, onSettled: () => void) => void,
    waitSettled?: boolean
  ) => void;
  waitSettled: boolean;
  hide: () => void;
}

export const useLangPopupStore = create<LangPopupStore>()((set) => ({
  open: false,
  callback: undefined,
  waitSettled: false,
  show: (callback, waitSettled) =>
    set({ open: true, callback, waitSettled: waitSettled || false }),
  hide: () => set({ open: false }),
}));
