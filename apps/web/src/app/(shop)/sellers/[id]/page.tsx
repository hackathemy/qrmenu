"use client";

import { Nav } from "@/components/nav";
import { Page } from "@/components/page";
import { Tabs } from "@/components/tabs";
import { Menus } from "./menus";
import { Contents } from "./contents";
import { Guide } from "./guide";
import { Pay } from "@/components/pay";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { apiClient } from "@hackathon-qrmenu/api-client";
import {
  AccountStatus,
  LangCode,
  Seller,
  SellerTranslateDto,
} from "@hackathon-qrmenu/type";
import { useLang } from "@/hooks/use-lang";
import { QuillViewer } from "@/components/quill-viewer";
import { Time } from "./time";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { useViewSellerStore } from "@hackathon-qrmenu/store";

export default function Seller() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { id: sellerId } = useParams();

  const langCode = useLang();

  const index = Number(searchParams.get("tab") || "0");

  const setIndex = (index) => router.push(pathname + "?tab=" + index);

  const querySeller = useSWR(sellerId ? `/sellers/${sellerId}` : null, (url) =>
    apiClient.get<{ seller: Seller }>(url)
  );

  const querySellerTranslate = useSWR(
    sellerId
      ? { url: `/sellers/${sellerId}/translate`, params: { langCode } }
      : null,
    (arg) =>
      apiClient.get<{ translate: SellerTranslateDto }>(arg.url, {
        params: arg.params,
      })
  );

  const querySellerTranslateKR = useSWR(
    sellerId
      ? {
          url: `/sellers/${sellerId}/translate`,
          params: { langCode: LangCode.KO },
        }
      : null,
    (arg) =>
      apiClient.get<{ translate: SellerTranslateDto }>(arg.url, {
        params: arg.params,
      })
  );

  const { t } = useTranslation();

  const [render, setRender] = useState(false);

  const process = useRef(false);
  const viewSeller = useViewSellerStore((s) => s);

  useEffect(() => {
    viewSeller.setSellerId(sellerId ? parseInt(sellerId as any) : null);
  }, [sellerId]);

  useEffect(() => {
    if (process.current) return;
    if (
      querySeller.data &&
      (!querySeller.data.data.seller.visible ||
        querySeller.data.data.seller.account.status !== AccountStatus.ACTIVE)
    ) {
      process.current = true;
      alert(t("invisible-seller"));
      router.replace("/");
    } else if (querySeller.data) {
      setRender(true);
    }
  }, [querySeller.data]);

  useEffect(() => {
    document.title = querySellerTranslate.data?.data.translate.name || "";
  }, [querySellerTranslate.data]);

  return (
    <Page nav={<Nav />}>
      <div className="bg-black">
        {/** Card */}
        <div>
          <div className="rounded-3xl bg-white shadow-md mx-3 translate-y-[50px] -mt-[50px] mb-2">
            <div className="p-5 flex flex-col">
              <h2 className="font-black text-[28px]/[40px]">
                {querySellerTranslate.data?.data.translate.name}
              </h2>

              <p className="text-[#666] text-[16px]">
                {querySellerTranslateKR.data?.data.translate.name}
              </p>

              <p className="mt-5 text-[#666] text-[12px]">
                <QuillViewer
                  html={
                    querySellerTranslate.data?.data.translate
                      .introductionHtml || ""
                  }
                  expand
                />
              </p>

              <Time timeString={querySeller.data?.data.seller.openTime || ""} />

              <Pay
                prepayment={querySeller.data?.data.seller.prepayment || false}
              />
            </div>
          </div>
          <div className="bg-white w-full h-[50px]" />
        </div>
      </div>

      {/** Tabs */}
      <div className="bg-white pt-3 sticky top-[52px] left-0 right-0 z-20">
        <Tabs
          tabs={[t("menu"), t("contents"), t("guide")]}
          index={index}
          onChange={setIndex}
        />
      </div>

      {index === 0 && render && <Menus />}
      {index === 1 && render && <Contents />}
      {index === 2 && render && <Guide />}
    </Page>
  );
}
