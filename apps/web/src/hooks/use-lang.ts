"use client";

import { useSettingStore } from "@hackathemy-qrmenu/store";
import { LangCode } from "@hackathemy-qrmenu/type";
import { useSearchParams } from "next/navigation";

export function useLang() {
  return useSettingStore((s) => s.langCode);

}
