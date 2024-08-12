import { create } from "zustand";
import { Account, Seller } from "@hackathon/type";

interface ViewSellerStore {
  sellerId: null | number;
  setSellerId: (sellerId: null | number) => void;
}

export const useViewSellerStore = create<ViewSellerStore>()((set) => ({
  sellerId: null,
  setSellerId: (sellerId) => set({ sellerId }),
}));
