import { create } from "zustand";
import { Account } from "@hackathon-qrmenu/type";

interface AccountStore {
  account: null | Account;
  setAccount: (account: null | Account) => void;
}

export const useAccountStore = create<AccountStore>()((set) => ({
  account: null,
  setAccount: (account) => set((state) => ({ account })),
}));
