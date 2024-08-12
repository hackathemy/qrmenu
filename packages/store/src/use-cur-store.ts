import { Menu, OptionGroup } from "@hackathon/type";
import { create } from "zustand";

interface CurStore {
  fetching: boolean;
  items: { unit: string; rate: number }[];
  setItems: (items: { unit: string; rate: number }[]) => void;
  setFetching: () => void;
}

export const useCurStore = create<CurStore>()((set) => ({
  fetching: false,
  setFetching: () => set({ fetching: true }),
  items: [],
  setItems: (items) => set({ items }),
}));
