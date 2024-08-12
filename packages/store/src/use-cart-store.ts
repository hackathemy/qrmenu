import { Menu, OptionGroup } from "@hackathon/type";
import { create } from "zustand";
export interface CartItem {
  menu: Menu;
  quantity: number;
  checked: boolean;
  options: OptionGroup[];
}
interface CartStore {
  items: CartItem[];
  setItems: (items: CartItem[]) => void;
}

export const useCartStore = create<CartStore>()((set) => ({
  items: [],
  setItems: (items) => set({ items }),
}));
