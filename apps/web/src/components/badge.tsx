"use client";

import Image from "next/image";
import { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
export const BadgeNew = () => {
  const { t } = useTranslation();
  return (
    <span className="py-0.5 px-2 rounded-3xl border-[1px] border-[#FF5C00] text-[#FF5C00] text-[8px] font-bold">
      {t("new")}
    </span>
  );
};

export const BadgeInfluencer = () => {
  const { t } = useTranslation();
  return (
    <span className="py-0.5 px-2 rounded-3xl border-[1px] border-[#ccc]  text-[8px] font-bold">
      {t("influncer")}
    </span>
  );
};

export const BadgeSoldOut = () => {
  const { t } = useTranslation();
  return (
    <span className="py-0.5 px-3 rounded-2xl border-[1px] border-[#DE4545] text-[#DE4545] text-[12px] font-bold">
      {t("sold-out")}
    </span>
  );
};

export const BadgeThumnbsUp = () => {
  return <Image width={14} height={14} alt="Thumbs Up" src="/thumbsup.png" />;
};

export const BadgeAdult = () => {
  const { t } = useTranslation();
  return (
    <span className="py-0.5 px-2 bg-[#f1f1f1] rounded-md border-[#ccc]  text-[12px] text-[#666]">
      {t("for-2-3-adult")}
    </span>
  );
};

export const BadgeAllegry = ({ children }: PropsWithChildren) => {
  return (
    <span
      className="py-2 px-5 bg-[#f1f1f1] rounded-3xl border-[#ccc]  text-[12px] text-[#666] mr-2 mb-2  font-bold last-of-type:mr-0
    "
    >
      {children}
    </span>
  );
};

export const Badges = ({ children }: PropsWithChildren) => {
  return (
    <div className="grid grid-flow-col auto-cols-max gap-x-1 items-center">
      {children}
    </div>
  );
};
