"use client";

import { AuthForm } from "@/components/auth-form";
import { ApiError, apiClient } from "@hackathon/api-client";
import { useAccountStore, useSellerStore } from "@hackathon/store";
import { HttpStatusCode } from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SellersCreateFinish() {
  const router = useRouter();

  const accountId = useAccountStore((s) => s.account?.id);
  const setSeller = useSellerStore((s) => s.setSeller);
  const setSellerExisting = useSellerStore((s) => s.setExisting);

  useEffect(() => {
    if (accountId) {
      apiClient
        .get("/accounts/" + accountId + "/seller")
        .then((res) => {
          setSeller(res.data.seller);
          setSellerExisting(true);
        })
        .catch((err) => {
          const apiError = err as ApiError;
          if (apiError.status == HttpStatusCode.NotFound) {
            setSellerExisting(false);
          }
        });
    }
  }, [accountId]);

  return (
    <AuthForm
      title="계정 생성 완료"
      divider
      buttons={[
        {
          text: "메뉴 정보 등록하기",
          onClick: () => {
            router.replace("/categories");
          },
          variation: "normal",
        },
        {
          text: "홈으로",
          onClick: () => {
            router.replace("/");
          },
          variation: "border",
        },
      ]}
    >
      <div className="flex flex-col items-center">
        <h2 className="text-[24px] font-bold text-center">
          계정 생성이 완료되었습니다.
        </h2>

        <span className="text-[#666] text-[14px] text-center mt-5">
          입력하신 내용을 관리자가 확인 후 승인처리합니다. <br />
          (영업일 3일 내에 처리됩니다.) <br />
          <br />
          승인 전에도 식당 이용 정보 및 메뉴 정보를 등록할 수 있습니다.
        </span>
      </div>
    </AuthForm>
  );
}
