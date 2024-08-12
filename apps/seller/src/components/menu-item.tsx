"use client";

import Image from "next/image";
import { DotsMenu } from "./dots-menu";
import { ReactNode, useMemo } from "react";
import { formatNumber } from "@/utils";

export const MenuItem = ({
  manage,
  name,
  isPrivate,
  isSoldOut,
  prcie,
  onSoldout,
  id,
  onDelete,
  src,
  content,
  onEdit,
  small,
  menu,
  leftComponent,
}: {
  menu?: boolean;
  content?: string;
  leftComponent?: ReactNode;
  prcie: number;
  small?: boolean;
  isPrivate: boolean;
  isSoldOut: boolean;
  src: string;
  manage?: boolean;
  id: number;
  name: string;
  onSoldout?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}) => {
  const ct = useMemo(() => {
    if (!content) return "";
    const span = document.createElement("span");
    span.innerHTML = content;
    return span.textContent;
  }, [content]);
  return (
    <div
      className={`flex items-center py-3 mb-3 px-5 ${
        !leftComponent && !small
          ? "border-[1px] rounded-2xl "
          : "border-b-[1px] last-of-type:border-b-0"
      } ${isSoldOut && "bg-[#f1f1f1]"}`}
    >
      {menu && (
        <Image
          width={24}
          height={24}
          src={"/menu.png"}
          alt="Menu"
          className="mr-3"
        />
      )}
      {leftComponent && leftComponent}

      <div className="w-[112px] h-[96px] bg-[#eee] border-[#ccc] border-[1px] relative rounded-lg overflow-hidden">
        <Image alt="Menu" fill src={src} />
      </div>
      <div className="flex-1 p-5 flex flex-col">
        <span className="font-bold text-[20px]">{name}</span>
        <span className="text-[14px] text-[#666]">
          {ct?.substring(0, 15) + ((ct?.length || 0) > 15 ? "..." : "")}
        </span>
      </div>

      <div
        className={`text-[14px] w-[80px] ${
          !isSoldOut ? "text-[#0000ff]" : "text-[#ff0000]"
        }`}
      >
        {isSoldOut ? "품절" : "판매"}
      </div>
      <div className="text-[14px] w-[80px]">{formatNumber(prcie)}원</div>
      {manage && (
        <DotsMenu
          id={id}
          menus={[
            { text: isSoldOut ? "품절 해제" : "품절", onClick: onSoldout },
            {
              text: "편집",
              onClick: onEdit,
            },
            { text: "삭제", onClick: onDelete },
          ]}
        />
      )}
    </div>
  );
};
