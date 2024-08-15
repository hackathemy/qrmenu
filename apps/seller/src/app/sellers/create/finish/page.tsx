"use client";

import { AuthForm } from "@/components/auth-form";
import { ApiError, apiClient } from "@hackathemy-qrmenu/api-client";
import { useAccountStore, useSellerStore } from "@hackathemy-qrmenu/store";
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

      </div>
    </AuthForm>
  );
}
