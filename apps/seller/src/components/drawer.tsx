"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Drawer = ({}) => {
  const pathname = usePathname();
  const renderLink = (label: string, href: string) => {
    return (
      <div>
        <Link
          href={href}
          className={`text-[#666] ${
            pathname.startsWith(href) &&
            "text-[#101010] border-b-[1px] border-[#101010] font-bold"
          }`}
        >
          {label}
        </Link>
      </div>
    );
  };

  return (
    <div className="sticky top-[60px] left-0 top-0 w-[240px] min-w-[240px]  max-[1440px]:min-w-[160px]  max-[1440px]:w-[160px] h-[calc(100vh-60px)] border-r-[1px] border-[#ddd] bg-white z-10">
      <div className="flex flex-col p-10 max-[1440px]:py-6 max-[1440px]:px-4">
        <Link className="flex items-center mb-12" href={"/"}>
          <Image src="/home.png" width={22} height={20} alt="Home" />
          <h3 className="font-bold text-[24px] ml-2">홈</h3>
        </Link>
        <span className="text-[20px] font-bold">식당정보</span>
        <div className="mt-5 mb-10 px-3 grid grid-flow-row auto-rows-auto gap-y-5">
          {renderLink("기본정보", "/info")}
          {renderLink("콘텐츠", "/contents")}
          {renderLink("이용가이드", "/guide")}
        </div>
        <span className="text-[20px] font-bold">메뉴 정보</span>
        <div className="mt-5 px-3 mb-10 grid grid-flow-row auto-rows-auto gap-y-5">
          {renderLink("카테고리 관리", "/categories")}
          {renderLink("메뉴 관리", "/menus")}
        </div>

        <div>
          <Link
            href={"/about"}
            className={
              pathname.startsWith("/about")
                ? "border-b-[1px] border-[#101010] font-bold"
                : ""
            }
          >
            About QRMenu
          </Link>
        </div>
      </div>
    </div>
  );
};
