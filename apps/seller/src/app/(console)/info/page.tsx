"use client";

import { Card } from "@/components/card";
import { LangSelector } from "@/components/lang-selector";
import { Modified } from "@/components/modified";
import { Page } from "@/components/page";
import { QuillViewer } from "@/components/quill-viewer";
import { Row, RowGrid } from "@/components/row";
import { SmallBorderButton } from "@/components/small-border-button";
import { useLang } from "@/hooks/use-lang";
import { formatPhoneNumber, wrapError } from "@/utils";
import { apiClient } from "@hackathon-qrmenu/api-client";
import { useLangPopupStore, useSellerStore } from "@hackathon-qrmenu/store";
import { Seller, SellerTranslateDto } from "@hackathon-qrmenu/type";
import { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import {
  ChangeTimePopup,
  InforUpdatePopup,
  InforUpdatePopupFormValue,
  IntroductipnUpdatePopup,
  PrepaymentUpdatePopup,
} from "./popup";
import { usePatchSeller } from "@/hooks/use-patch-seller";
import { OpenTimes } from "@/components/open-time";

export default function Info() {
  const [changeSP, setChangeSP] = useState(false);
  const [changeP, setChangeP] = useState(false);
  const [changeTime, setChangeTime] = useState(false);

  const [introductionPopup, setIntroductionPopup] = useState(false);

  const langCode = useLang();
  const seller = useSellerStore((s) => s.seller);
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

  const showLangPopup = useLangPopupStore((s) => s.show);

  const handleIntroductionUpdate = (introductionHtml: string) => {
    showLangPopup((withTranslate, onSettled) => {
      setIntroductionPopup(false);

      apiClient
        .patch(`/sellers/${sellerId}/translate/${data?.id}`, {
          translate: { introductionHtml },
          updateMask: "introductionHtml",
          withTranslate,
        })
        .then((res) => {
          setData(res.data.translate);
          // alert("변경한 내용을 저장했습니다.");
          // setIntroductionPopup(false);
        });
      /*
        .catch(
          wrapError((error) => {
            alert("저장 실패했습니다.");
          })
        )
        .finally(onSettled);*/
      onSettled();
    });
  };

  const patchSeller = usePatchSeller();

  const handleInfoUpdate = (values: InforUpdatePopupFormValue) => {
    patchSeller.patch({ contact: values.contact } as Seller);

    showLangPopup((withTranslate, onSettled) => {
      setChangeSP(false);
      apiClient
        .patch(`/sellers/${sellerId}/translate/${data?.id}`, {
          translate: {
            name: values.name,
            address: values.address,
            addressDetail: values.addressDetail,
          },
          updateMask: "name,address,addressDetail",
          withTranslate,
        })
        .then((res) => {
          setData(res.data.translate);
          //alert("변경한 내용을 저장했습니다.");
        })
        /*
        .catch(
          wrapError((error) => {
            alert("저장 실패했습니다.");
          })
        )
        .finally(onSettled);*/
        onSettled()
    });
  };

  const handlePrepaymentUpdate = (prepayment: boolean) => {
    patchSeller
      .patch({ prepayment: prepayment } as Seller)
      .then(() => {
        setChangeP(false);
        alert("변경한 내용을 저장했습니다.");
      })
      .catch(
        wrapError((error) => {
          alert("저장 실패했습니다.");
        })
      );
  };

  const handleOpenTimeUpdate = (openTime: string) => {
    patchSeller
      .patch({ openTime: openTime } as Seller)
      .then(() => {
        setChangeTime(false);
        alert("변경한 내용을 저장했습니다.");
      })
      .catch(
        wrapError((error) => {
          alert("저장 실패했습니다.");
        })
      );
  };

  return (
    <Page label="기본 정보" labelRightComponent={<LangSelector />}>
      {changeSP && (
        <InforUpdatePopup
          onClose={() => {
            setChangeSP(false);
          }}
          onUpdate={handleInfoUpdate}
          initialValue={{
            contact: seller?.contact || "",
            name: data?.name || "",
            address: data?.address || "",
            addressDetail: data?.addressDetail || "",
          }}
        />
      )}

      {changeP && (
        <PrepaymentUpdatePopup
          onClose={() => {
            setChangeP(false);
          }}
          onUpdate={handlePrepaymentUpdate}
          initialValue={seller?.prepayment}
        />
      )}

      {changeTime && (
        <ChangeTimePopup
          initialValue={seller?.openTime || ""}
          onClose={() => {
            setChangeTime(false);
          }}
          onUpdate={handleOpenTimeUpdate}
        />
      )}
      {introductionPopup && (
        <IntroductipnUpdatePopup
          onClose={() => {
            setIntroductionPopup(false);
          }}
          initialValue={data?.introductionHtml}
          onUpdate={handleIntroductionUpdate}
        />
      )}
      {data && (
        <div className="grid grid-cols-2 gap-5 auto-rows-min max-[1440px]:grid-cols-1">
          <div>
            <Card
              title="기본 정보"
              titleRightComponent={
                <SmallBorderButton onClick={() => setChangeSP(true)}>
                  편집
                </SmallBorderButton>
              }
            >
              <RowGrid>
                <Row label="식당명" content={data.name} />
                <Row
                  label="식당 전화번호"
                  content={formatPhoneNumber(seller?.contact || "")}
                />
                <Row
                  label="식당 주소"
                  className="col-start-1 col-end-3"
                  content={data.address + " " + data.addressDetail}
                />
              </RowGrid>
              <Modified
                updatedAt={data.nameUpdatedAt}
                translatedAt={data.nameTranslatedAt}
              />
            </Card>
          </div>
          <div>
            <Card
              title="식당 소개"
              titleRightComponent={
                <SmallBorderButton onClick={() => setIntroductionPopup(true)}>
                  편집
                </SmallBorderButton>
              }
            >
              <QuillViewer html={data.introductionHtml} />
              <Modified
                updatedAt={data.introductionHtmlUpdatedAt}
                translatedAt={data.introductionHtmlTranslatedAt}
              />
            </Card>
          </div>
          <div>
            <Card
              title="영업시간"
              titleRightComponent={
                <SmallBorderButton onClick={() => setChangeTime(true)}>
                  편집
                </SmallBorderButton>
              }
            >
              {seller?.openTime ? (
                <OpenTimes value={seller?.openTime || ""} />
              ) : (
                <span className="text-[#999]">설정한 내용이 없습니다.</span>
              )}
            </Card>
          </div>
          <div>
            <Card
              title="선불/후불"
              titleRightComponent={
                <SmallBorderButton onClick={() => setChangeP(true)}>
                  편집
                </SmallBorderButton>
              }
            >
              {seller?.prepayment === null ? (
                <span className="text-[#999]">설정한 내용이 없습니다.</span>
              ) : seller?.prepayment ? (
                "선불제"
              ) : (
                "후불제"
              )}
            </Card>
          </div>
        </div>
      )}
    </Page>
  );
}
