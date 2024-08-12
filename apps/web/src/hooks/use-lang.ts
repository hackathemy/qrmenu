"use client";

import { useSettingStore } from "@hackathon-qrmenu/store";
import { LangCode } from "@hackathon-qrmenu/type";
import { useSearchParams } from "next/navigation";

export function useLang() {
  return useSettingStore((s) => s.langCode);

}
