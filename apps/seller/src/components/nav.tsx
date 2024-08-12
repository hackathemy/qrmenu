"use client";

import { apiClient } from "@hackathon-qrmenu/api-client";
import { useAccountStore, useSellerStore } from "@hackathon-qrmenu/store";
import { AccountStatus, LangCode, SellerTranslateDto } from "@hackathon-qrmenu/type";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const Nav = ({}) => {
  const handleLogOut = () => {
    fetch("/api/signout", { method: "POST" }).then(() => {
      window.location.replace("/signin");
    });
  };

  const seller = useSellerStore((s) => s.seller);
  const account = useAccountStore((s) => s.account);

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
    <div className="w-full fixed top-0 left-0 right-0 text-[#101010] z-30 bg-white">
      <nav className="flex w-full">
        <div className="mx-auto w-full max-w-1920px flex items-center px-10 h-[60px] border-b-[1px] border-[#eee]">
          {/** Logo */}
          <div className="min-w-[240px] max-[1440px]:min-w-[160px]">
            <h1 className="text-[24px]/[34px] font-black">Admin</h1>
          </div>
          {/** Menus */}
          <div className="flex-grow flex items-center">
            <h2 className="text-[20px] font-bold">
              {data?.name || seller?.name}
            </h2>

            {account?.status === AccountStatus.ACTIVE && (
              <Link
                href={"/menus"}
                className="flex items-center border-[1px] rounded-md border-[#ccc] ml-5 py-2 px-3 text-[#666] text-[14px]"
              >
                <Image
                  src="/ext.png"
                  width={15}
                  height={15}
                  alt="Ext"
                  className="mr-2.5"
                />
                내 메뉴 정보
              </Link>
            )}
          </div>
          {/** Options */}
          <div className="grid grid-flow-col auto-cols-auto gap-x-5 text-[14px]/[20px]">
            <span>
              <span className="font-bold">{seller?.ceoName}</span>님
            </span>
            <button className="flex items-center" onClick={handleLogOut}>
              <Image
                alt="Logout"
                src="/logout.png"
                width={20}
                height={20}
                className="mr-1"
              />
              로그아웃
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};
