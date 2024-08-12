import { create } from "zustand";

interface SessionStore {
  accessToken: string;
  accountId: number;
  setAccessToken: (accessToken: string) => void;
  setAccountId: (accountId: number) => void;
}

export const useSessionStore = create<SessionStore>()((set) => ({
  accessToken: "",
  accountId: 0,
  setAccessToken: (accessToken) => set((state) => ({ accessToken })),
  setAccountId: (accountId) => set((state) => ({ accountId })),
}));
