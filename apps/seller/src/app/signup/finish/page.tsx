"use client";

import { AuthForm } from "@/components/auth-form";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpFinish() {
  const router = useRouter();
  return (
    <AuthLayout>
      <div className="flex flex-col items-center">
        <h2 className="text-[24px] font-bold text-center">
          회원가입이
          <br />
          완료되었습니다.
        </h2>
        <p className="mt-5 text-[16px]">생성된 계정으로 로그인해주세요</p>
        <Link href={"/signin"} className="mt-10 w-[300px]">
          <Button className="w-full">로그인</Button>
        </Link>
      </div>
    </AuthLayout>
  );
}
