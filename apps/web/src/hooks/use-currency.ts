"use client";

import { useSettingStore } from "@hackathon-qrmenu/store";

export function useCurrency() {
  return useSettingStore((s) => s.currency);
}
