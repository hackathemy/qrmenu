"use client";

import { LangCode } from "@hackathon/type";
import { useSearchParams } from "next/navigation";

export function useLang() {
  const searchParams = useSearchParams();
  const langCode = (searchParams.get("langCode") || LangCode.KO) as LangCode;

  return langCode;
}
