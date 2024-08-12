"use client";

import { AuthForm } from "@/components/auth-form";
import { Step } from "@/components/step";
import { useSellerStore } from "@hackathon-qrmenu/store";
import { useRouter } from "next/navigation";

export default function SellersCreate() {
  const router = useRouter();

  const seller = useSellerStore((s) => s.seller);

  const handleLogOut = () => {
    fetch("/api/signout", { method: "POST" }).then(() => {
      window.location.replace("/signin");
    });
  };

  return (
    <AuthForm
      gap="gap-y-10"
      title="식당정보 등록 안내"
      buttons={[
        {
          text: "취소",
          onClick: () => {
            handleLogOut();
          },
        },
        { text: "식당정보 등록하기" },
      ]}
      formProps={{
        onSubmit: (e) => {
          e.preventDefault();
          router.push("/sellers/create/info");
        },
      }}
    >
      <div className="border-[#eee] border-t-[1px] flex items-center pt-10 justify-center">
        <Step label="식당정보 등록" step={1} focus={!seller?.id} />
      </div>

      <div className="flex flex-col items-center">
        <h2 className="text-[24px] font-bold text-center">환영합니다.</h2>

        <span className="text-[#666] text-[14px] text-center mt-5">
          식당페이지 생성 및 서비스 이용을 위해
          <br />
          식당정보 등록이 필요합니다.
        </span>
      </div>
    </AuthForm>
  );
}
