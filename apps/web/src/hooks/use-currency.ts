"use client";

import { useSettingStore } from "@hackathemy-qrmenu/store";

export function useCurrency() {
  return useSettingStore((s) => s.currency);
}
