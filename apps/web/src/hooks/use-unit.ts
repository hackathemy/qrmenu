import { useSettingStore } from "@hackathemy-qrmenu/store";

export function useUnit() {
  return useSettingStore((s) => s.unit);
}
