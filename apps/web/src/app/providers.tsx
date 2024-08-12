"use client";
import { setBaseUrl } from "@hackathon/api-client";
import { ReactNode, useEffect } from "react";
import React from "react";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import resources from "./translation.json";
import { useLang } from "@/hooks/use-lang";

i18n.use(initReactI18next).init({
  resources: resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

setBaseUrl(process.env.NEXT_PUBLIC_API_URL as string);

export default function Providers({ children }: { children: ReactNode }) {
  const langCode = useLang();
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(langCode);
  }, [langCode]);

  return <>{children}</>;
}
