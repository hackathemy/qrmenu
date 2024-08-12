"use client";

import { useSettingStore } from "@hackathon/store";
import { LangCode } from "@hackathon/type";
import { useSearchParams } from "next/navigation";

export function useLang() {
  return useSettingStore((s) => s.langCode);

}
