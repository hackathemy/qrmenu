import { useSettingStore } from "@hackathon-qrmenu/store";

export function useUnit() {
  return useSettingStore((s) => s.unit);
}
