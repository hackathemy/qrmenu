"use client";

import { GuideExpand } from "@/components/guide-expand";
import { Page } from "@/components/page";
import { PayItem } from "@/components/pay-item";
import { Qr } from "@/components/qr";
import { Row } from "@/components/row";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import {
  PaymentValues,
  UpdateEditorPopoup,
  UpdatePaymentPopup,
  UpdateWiFiPopup,
  WiFiForm,
} from "./popup";
import { useLangPopupStore, useSellerStore } from "@hackathemy-qrmenu/store";
import { usePatchSeller } from "@/hooks/use-patch-seller";
import { Seller, SellerTranslateDto, UsageGuide } from "@hackathemy-qrmenu/type";
import { QuillViewer } from "@/components/quill-viewer";
import { useLang } from "@/hooks/use-lang";
import { apiClient } from "@hackathemy-qrmenu/api-client";
import { HttpStatusCode } from "axios";
import { wrapError } from "@/utils";
import { Modified } from "@/components/modified";
import { LangSelector } from "@/components/lang-selector";
import { Drag } from "@/components/drag";
import update from "immutability-helper";
export type UpdateField =
  | "toiletHtml"
  | "parkingHtml"
  | "kidsHtml"
  | "accessibilityHtml";

export default function Guide({}) {
  const [w, setW] = useState(false);
  const [p, setP] = useState(false);
  const [updateField, setUpdateField] = useState<UpdateField | null>(null);

  const seller = useSellerStore((s) => s.seller);
  const langCode = useLang();
  const sellerId = seller?.id;

  const [data, setData] = useState<SellerTranslateDto | null>(null);

  const fetchTranslateData = () => {
    apiClient
      .get(`/sellers/${sellerId}/translate`, { params: { langCode } })
      .then((res) => setData(res.data.translate))
      .catch(
        wrapError((error) => {
          if (error.status === HttpStatusCode.NotFound) {
            apiClient
              .post(`/sellers/${sellerId}/translate`, { langCode })
              .then((res) => setData(res.data.translate));
          }
        })
      );
  };

  useEffect(() => {
    if (langCode && sellerId) {
      fetchTranslateData();
    }
  }, [langCode, sellerId]);

  const patchSeller = usePatchSeller();

  const handleUpdateWifi = async (seller: WiFiForm) => {
    patchSeller.patch(seller as Seller).then(() => {
      alert("변경한 내용을 저장했습니다.");
      setW(false);
    });
  };

  const handleUpdatePayment = async (seller: PaymentValues) => {
    patchSeller.patch(seller as Seller).then(() => {
      alert("변경한 내용을 저장했습니다.");
      setP(false);
    });
  };

  const handleUpdateSeller = async (seller: Seller) => {
    patchSeller.patch(seller).then(() => {});
  };

  const showLangPopup = useLangPopupStore((s) => s.show);

  const handleUpdateField = async (field: UpdateField, html: string) => {
    showLangPopup((withTranslate, onSettled) => {
      apiClient
        .patch(`/sellers/${sellerId}/translate/${data?.id}`, {
          translate: { [field]: html },
          updateMask: field,
          withTranslate,
        })
        .then((res) => {
          setData(res.data.translate);
          setUpdateField(null);
          alert("변경한 내용을 저장했습니다.");
        })
        .catch(
          wrapError((error) => {
            alert("저장 실패했습니다.");
          })
        )
        .finally(onSettled);
    });
  };

  const [list, setList] = useState<UsageGuide[]>([]);

  useEffect(() => {
    movedRef.current = false;
    if (seller?.guideOrders?.length) {
      setList(seller.guideOrders);
    } else {
      setList(Object.values(UsageGuide));
    }
  }, [seller?.guideOrders]);

  const mapComponent = {
    [UsageGuide.WiFi]: (
      <GuideExpand
        title="Wi-Fi"
        onEdit={() => {
          if (seller?.enabledWifi) {
            setW(true);
          }
        }}
        enabled={!!seller?.enabledWifi}
        onEnabled={(checked) => {
          handleUpdateSeller({ enabledWifi: checked } as Seller);
        }}
      >
        {seller?.enabledWifi && (
          <>
            <Row large label="와이파이 이름" content={seller.wifiSSID} />
            <Row large label="와이파이 비밀번호" content={seller.wifiKey} />
            <Qr
              size={100}
              url={`WIFI:T:WPA;S:${seller.wifiSSID};P:${seller.wifiKey};;`}
            />
          </>
        )}
      </GuideExpand>
    ),
    [UsageGuide.Toilet]: (
      <GuideExpand
        title="Toilet"
        onEdit={() => {
          setUpdateField("toiletHtml");
        }}
        enabled={!!seller?.enabledToilet}
        onEnabled={(checked) => {
          handleUpdateSeller({ enabledToilet: checked } as Seller);
        }}
      >
        {seller?.enabledToilet && data && (
          <div className="flex flex-col">
            <QuillViewer html={data.toiletHtml} />
            <Modified
              updatedAt={data.toiletHtmlUpdatedAt}
              translatedAt={data.toiletHtmlTranslatedAt}
            />
          </div>
        )}
      </GuideExpand>
    ),
    [UsageGuide.Accessibilitys]: (
      <GuideExpand
        title="Accessibilitys"
        onEdit={() => {
          setUpdateField("accessibilityHtml");
        }}
        enabled={!!seller?.enabledAccessibility}
        onEnabled={(checked) => {
          handleUpdateSeller({ enabledAccessibility: checked } as Seller);
        }}
      >
        {seller?.enabledAccessibility && data && (
          <div className="flex flex-col">
            <QuillViewer html={data.accessibilityHtml} />
            <Modified
              updatedAt={data.accessibilityHtmlUpdatedAt}
              translatedAt={data.accessibilityHtmlTranslatedAt}
            />
          </div>
        )}
      </GuideExpand>
    ),
    [UsageGuide.Parking]: (
      <GuideExpand
        title="Parking"
        onEdit={() => {
          setUpdateField("parkingHtml");
        }}
        enabled={!!seller?.enabledParking}
        onEnabled={(checked) => {
          handleUpdateSeller({ enabledParking: checked } as Seller);
        }}
      >
        {seller?.enabledParking && data && (
          <div className="flex flex-col">
            <QuillViewer html={data.parkingHtml} />
            <Modified
              updatedAt={data.parkingHtmlUpdatedAt}
              translatedAt={data.parkingHtmlTranslatedAt}
            />
          </div>
        )}
      </GuideExpand>
    ),
    [UsageGuide.Payments]: (
      <GuideExpand
        title="Payments"
        onEdit={() => {
          setP(true);
        }}
        enabled={!!seller?.enabledPayment}
        onEnabled={(checked) => {
          handleUpdateSeller({ enabledPayment: checked } as Seller);
        }}
      >
        <span className="text-[16px] font-extrabold">현금</span>
        <div className="grid grid-cols-3 gap-y-1 mt-3 mb-5">
          {(seller?.paymentCashTypes || []).map((x) => (
            <PayItem type={x} key={x} />
          ))}
        </div>

        <span className="text-[14px] font-extrabold">신용카드</span>
        <div className="grid grid-cols-3 gap-y-1 mt-3 mb-5">
          {(seller?.paymentCardTypes || []).map((x) => (
            <PayItem type={x} key={x} />
          ))}
        </div>

        <span className="text-[14px] font-extrabold">스마트페이</span>
        <div className="grid grid-cols-3 gap-y-1 mt-3 mb-5">
          {(seller?.paymentSmartPayTypes || []).map((x) => (
            <PayItem type={x} key={x} />
          ))}
        </div>
      </GuideExpand>
    ),
    [UsageGuide.BabyKids]: (
      <GuideExpand
        title="Baby & Kids"
        onEdit={() => {
          setUpdateField("kidsHtml");
        }}
        enabled={!!seller?.enabledKids}
        onEnabled={(checked) => {
          handleUpdateSeller({ enabledKids: checked } as Seller);
        }}
      >
        {seller?.enabledKids && data && (
          <div className="flex flex-col">
            <QuillViewer html={data.kidsHtml} />
            <Modified
              updatedAt={data.kidsHtmlUpdatedAt}
              translatedAt={data.kidsHtmlTranslatedAt}
            />
          </div>
        )}
      </GuideExpand>
    ),
  };

  const movedRef = useRef(false);
  const move = useCallback((dragIndex: number, hoverIndex: number) => {
    movedRef.current = true;
    setList((prevCards: any[]) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex] as any],
        ],
      })
    );
  }, []);

  useEffect(() => {
    if (!movedRef.current) return;

    let tm = setTimeout(() => {
      patchSeller.patch({ guideOrders: list } as Seller).then(() => {});
    }, 500);

    return () => {
      clearTimeout(tm);
    };
  }, [list]);

  return (
    <Page label="이용가이드" labelRightComponent={<LangSelector />}>
      {updateField && (
        <UpdateEditorPopoup
          key={updateField}
          type={updateField}
          initialValue={data ? data[updateField] : ""}
          onUpdate={(html) => handleUpdateField(updateField, html)}
          onClose={() => {
            setUpdateField(null);
          }}
        />
      )}

      {w && (
        <UpdateWiFiPopup
          onClose={() => {
            setW(false);
          }}
          initialValue={{
            wifiKey: seller?.wifiKey || "",
            wifiSSID: seller?.wifiSSID || "",
          }}
          onUpdate={handleUpdateWifi}
        />
      )}

      {p && (
        <UpdatePaymentPopup
          onChange={handleUpdatePayment}
          onClose={() => setP(false)}
          values={{
            prepayment: seller?.prepayment,
            paymentCardTypes: seller?.paymentCardTypes || [],
            paymentSmartPayTypes: seller?.paymentSmartPayTypes || [],
            paymentCashTypes: seller?.paymentCashTypes || [],
          }}
        />
      )}

      <div className="flex flex-col">
        <div className="w-full mx-auto max-w-[800px] p-10">
          {list.map((x, i) => (
            <Fragment key={x + i}>
              <Drag id={x} index={i} type="guide" move={move}>
                {mapComponent[x]}
              </Drag>
            </Fragment>
          ))}
        </div>
      </div>
    </Page>
  );
}
