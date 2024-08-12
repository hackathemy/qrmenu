import { Expand } from "@/components/expand";
import { Pay } from "@/components/pay";
import { PayItem } from "@/components/pay-item";
import { Qr } from "@/components/qr";
import { QuillViewer } from "@/components/quill-viewer";
import { useLang } from "@/hooks/use-lang";
import { apiClient } from "@hackathon/api-client";
import { Seller, SellerTranslateDto, UsageGuide } from "@hackathon/type";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

export const Guide = ({}) => {
  const { t } = useTranslation();
  const { id: sellerId } = useParams();

  const langCode = useLang();

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

  // querySeller.data?.data.seller.guideOrders;

  const [list, setList] = useState<UsageGuide[]>([]);

  useEffect(() => {
    if (querySeller.data?.data?.seller?.guideOrders?.length) {
      setList(querySeller.data?.data?.seller?.guideOrders);
    } else {
      setList(Object.values(UsageGuide));
    }
  }, [querySeller.data?.data?.seller?.guideOrders]);

  const components = {
    [UsageGuide.WiFi]: (
      <Expand
        icon={<Image alt="Wi" width={22} height={18} src="/wifi.png" />}
        title={t("wifi")}
      >
        {querySeller.data?.data.seller.enabledWifi && (
          <>
            <div className="flex items-center">
              <Qr
                size={100}
                url={`WIFI:T:WPA;S:${querySeller.data.data.seller.wifiSSID};P:${querySeller.data.data.seller.wifiKey};;`}
              />

              <div className="flex flex-col ml-5">
                <div className="flex flex-col">
                  <span className="text-[14px] text-[#666666]">
                    {t("wifi-name")}
                  </span>
                  <span className="text-[14px] text-[#110000] font-medium mt-1">
                    {querySeller.data.data.seller.wifiSSID}
                  </span>
                </div>

                <div className="flex flex-col mt-2">
                  <span className="text-[14px] text-[#666666]">
                    {t("wifi-pw")}
                  </span>
                  <span className="text-[14px] text-[#110000] font-medium mt-1">
                    {querySeller.data.data.seller.wifiKey}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </Expand>
    ),
    [UsageGuide.Toilet]: (
      <Expand
        icon={<Image alt="Toilet" width={24} height={24} src="/toilet.png" />}
        title={t("toilet")}
      >
        <QuillViewer
          html={querySellerTranslate.data?.data.translate.toiletHtml || ""}
        />
      </Expand>
    ),
    [UsageGuide.BabyKids]: (
      <Expand
        icon={<Image alt="Baby" width={20} height={20} src="/baby.png" />}
        title={t("kids")}
      >
        <QuillViewer
          html={querySellerTranslate.data?.data.translate.kidsHtml || ""}
        />
      </Expand>
    ),
    [UsageGuide.Payments]: (
      <Expand
        icon={
          <Image alt="Payments" width={20} height={18} src="/payments.png" />
        }
        title={t("payments")}
      >
        <>
          <span className="text-[16px] font-extrabold">Payments Method</span>
          <Pay prepayment={querySeller.data?.data.seller.prepayment || false} />
          <div className="h-[1px] bg-[#eee] my-6" />
        </>
        <>
          <span className="text-[16px] font-extrabold">Payments Accepted</span>
          <div className="grid grid-cols-2 gap-y-1 mt-3 mb-5">
            {(querySeller.data?.data.seller?.paymentCashTypes || []).map(
              (x) => (
                <PayItem type={x} key={x} />
              )
            )}
          </div>
        </>
        <>
          <span className="text-[14px] font-extrabold">Credit Card</span>
          <div className="grid grid-cols-2 gap-y-1 mt-3 mb-5">
            {(querySeller.data?.data.seller?.paymentCardTypes || []).map(
              (x) => (
                <PayItem type={x} key={x} />
              )
            )}
          </div>
        </>

        <>
          <span className="text-[14px] font-extrabold">Smart Payment</span>
          <div className="grid grid-cols-2 gap-y-1 mt-3 mb-5">
            {(querySeller.data?.data.seller?.paymentSmartPayTypes || []).map(
              (x) => (
                <PayItem type={x} key={x} />
              )
            )}
          </div>
        </>
      </Expand>
    ),
    [UsageGuide.Accessibilitys]: (
      <Expand
        icon={
          <Image
            alt="Accessibility"
            width={17}
            height={18}
            src="/accessibility.png"
          />
        }
        title={t("accessibility")}
      >
        <QuillViewer
          html={
            querySellerTranslate.data?.data.translate.accessibilityHtml || ""
          }
        />
      </Expand>
    ),
    [UsageGuide.Parking]: (
      <Expand
        icon={<Image alt="Parking" width={18} height={18} src="/parking.png" />}
        title={t("parking")}
      >
        <QuillViewer
          html={querySellerTranslate.data?.data.translate.parkingHtml || ""}
        />
      </Expand>
    ),
  };

  const enalbeds = {
    [UsageGuide.Accessibilitys]:
      querySeller.data?.data.seller.enabledAccessibility,
    [UsageGuide.BabyKids]: querySeller.data?.data.seller.enabledKids,
    [UsageGuide.Parking]: querySeller.data?.data.seller.enabledParking,
    [UsageGuide.Payments]: querySeller.data?.data.seller.enabledPayment,
    [UsageGuide.Toilet]: querySeller.data?.data.seller.enabledToilet,
    [UsageGuide.WiFi]: querySeller.data?.data.seller.enabledWifi,
  };

  return (
    <div>
      <h3 className="font-extrabold text-[20px]/[28px] m-4">
        {t("usage-guide")}
      </h3>
      {list.map((x, i) => {
        if (!enalbeds[x]) return null;

        return <Fragment key={i}>{components[x]}</Fragment>;
      })}
    </div>
  );
};

/**  {querySeller.data?.data.seller.enabledWifi && (
    
      )}
      {querySeller.data?.data.seller.enabledToilet && (
      
      )}
      {querySeller.data?.data.seller.enabledKids && (
      
      )}
      {querySeller.data?.data.seller.enabledPayment && (
     
      )}
      {querySeller.data?.data.seller.enabledAccessibility && (
     
      )}
      {querySeller.data?.data.seller.enabledParking && (
        
      )} */
