"use client";

import { useSettingStore } from "@hackathon/store";

export function useCurrency() {
  return useSettingStore((s) => s.currency);
}
