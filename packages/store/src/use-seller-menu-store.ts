import { create } from "zustand";

interface SellerMenuStore {
  id: number | null;
  categoryId: number | null;
  setId: (id: number | null) => void;
  setCategoryId: (categoryId: number | null) => void;
}

export const useSellerMenuStore = create<SellerMenuStore>()((set) => ({
  id: null,
  categoryId: null,
  setId: (id) => set((state) => ({ id })),
  setCategoryId: (categoryId) => set((state) => ({ categoryId })),
}));
