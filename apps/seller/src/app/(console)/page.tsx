"use client";

import { Card } from "@/components/card";
import { Column } from "@/components/column";
import { Page } from "@/components/page";
import { Qr } from "@/components/qr";
import { SmallBorderButton } from "@/components/small-border-button";
import { Switch } from "@/components/switch";
import { usePatchSeller } from "@/hooks/use-patch-seller";
import { formatPhoneNumber } from "@/utils";
import { apiClient } from "@hackathon/api-client";
import { useAccountStore, useSellerStore } from "@hackathon/store";
import { LangCode, Seller, SellerTranslateDto } from "@hackathon/type";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const seller = useSellerStore((s) => s.seller);
  const account = useAccountStore((s) => s.account);

  const patchSeller = usePatchSeller();

  const handleVisible = async (visible: boolean) => {
    patchSeller.patch({ visible } as Seller);
  };

  const [data, setData] = useState<SellerTranslateDto | null>(null);

  const fetchTranslateData = () => {
    apiClient
      .get(`/sellers/${seller?.id}/translate`, {
        params: { langCode: LangCode.KO },
      })
      .then((res) => setData(res.data.translate));
  };

  useEffect(() => {
    if (seller?.id) {
      fetchTranslateData();
    }
  }, [seller?.id]);

  return (
    <Page label="홈">
      <div className="flex items-center justify-between">
        <span className="font-bold text-[24px]">
          반갑습니다. {seller?.ceoName}님
        </span>
        <Switch
          label="식당페이지 노출"
          value={!!seller?.visible}
          onChange={handleVisible}
        />
      </div>
      <div className="grid grid-cols-2 gap-x-10 mt-10 max-[1440px]:grid-cols-1">
        <div className="grid grid-cols-2 gap-5 max-[1440px]:flex max-[1440px]:flex-col">
          <Card title="계정정보" link="/account" titleDivier>
            <div className="grid gap-y-5">
              <Column label="이메일 ID" content={account?.email} />
              <Column label="대표자명" content={seller?.ceoName} />
              <Column
                label="담당자 전화번호"
                content={formatPhoneNumber(seller?.managerPhoneNumber || "")}
              />
            </div>
          </Card>
          <Card title="기본정보" link="/info" titleDivier>
            <div className="grid gap-y-5">
              <Column label="식당명" content={data?.name || seller?.name} />
              <Column
                label="식당 전화번호"
                content={formatPhoneNumber(seller?.contact || "")}
              />
              <Column
                label="식당 주소"
                content={
                  (data?.address || seller?.address) +
                  " " +
                  (data?.addressDetail || seller?.addressDetail)
                }
              />
            </div>
          </Card>
          <Card className="col-start-1 col-end-3" title="바로가기" titleDivier>
            <div className="grid grid-cols-2 gap-5">
              <Link href={"/contents"}>콘텐츠 관리</Link>
              <Link href={"/guide"}>이용가이드</Link>
              <Link href={"/categories"}>카테고리 관리</Link>
              <Link href={"/menus"}>메뉴 관리</Link>
            </div>
          </Card>
        </div>
        <div className="grid gap-5 max-[1440px]:grid-cols-2 max-[1440px]:mt-5">
          <Card title="식당 QR 메뉴 주소">
            <div className="flex flex-col items-start">
              <Link
                className="border-b-[1px] border-b-[#101010]"
                href={`${process.env.NEXT_PUBLIC_WEB_URL}/sellers/${seller?.id}`}
                target="_blank"
              >
                {`${process.env.NEXT_PUBLIC_WEB_URL}/sellers/${seller?.id}`}
              </Link>
              <Qr
                url={`${process.env.NEXT_PUBLIC_WEB_URL}/sellers/${seller?.id}`}
              />
            </div>
          </Card>
          <Card
            title="와이파이 QR 코드"
            titleComponent={
              <Link href={"/guide"}>
                <SmallBorderButton>정보입력</SmallBorderButton>
              </Link>
            }
          >
            {seller?.wifiSSID ? (
              <div>
                <span className="text-[14px] text-[#666] block">
                  이미지를 다운로드하여 사용하세요.
                </span>
                <Qr
                  url={`WIFI:T:WPA;S:${seller.wifiSSID};P:${seller.wifiKey};;`}
                />
              </div>
            ) : (
              <span className="text-[14px] text-[#666] block">
                [이용 가이드]에서 와이파이 정보를 입력하시면 QR코드가
                생성됩니다.
              </span>
            )}
          </Card>
        </div>
      </div>
    </Page>
  );
}
