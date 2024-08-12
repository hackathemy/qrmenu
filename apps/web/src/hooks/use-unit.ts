import { useSettingStore } from "@hackathon/store";

export function useUnit() {
  return useSettingStore((s) => s.unit);
}
