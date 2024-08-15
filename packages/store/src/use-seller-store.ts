import { create } from "zustand";
import { Account, Seller } from "@hackathemy-qrmenu/type";

interface SellerStore {
  seller: null | Seller;
  existing: boolean | null;
  setSeller: (seller: null | Seller) => void;
  setExisting: (existing: boolean | null) => void;
}

export const useSellerStore = create<SellerStore>()((set) => ({
  seller: null,
  existing: null,
  setSeller: (seller) => set((state) => ({ seller })),
  setExisting: (existing) => set((state) => ({ existing })),
}));
