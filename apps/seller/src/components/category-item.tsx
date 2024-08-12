"use client";

import Image from "next/image";
import { DotsMenu } from "./dots-menu";

export const CategoryItem = ({
  pri,
  name,
  menuTotalSize,
  onEdit,
  onDelete,
  onClick,
  id,
}: {
  id: number;
  onEdit: () => void;
  onDelete: () => void;
  pri?: boolean;
  name: string;
  onClick?: () => void;
  menuTotalSize: number;
}) => {
  return (
    <div
      onClick={onClick}
      className={` cursor-pointer pl-5 flex items-center border-[1px] py-3 rounded-2xl ${
        pri && " bg-[#f1f1f1]"
      }`}
    >
      <Image
        width={24}
        height={24}
        src={"/menu.png"}
        alt="Menu"
        className="mr-3"
      />

      <div className="flex-1 p-5 pl-0 flex flex-col items-start">
        <span className={"font-bold text-[20px] " + (pri && "text-[#999]")}>
          {name}
        </span>
        <span className={"text-[14px] " + (pri && "text-[#999]")}>
          메뉴 {menuTotalSize}개
        </span>
      </div>
      {pri && (
        <span className="text-[#ff0000] text-[14px] w-[64px] text-center">
          비공개
        </span>
      )}

      <div className="mx-4">
        <DotsMenu
          category
          id={id}
          menus={[
            {
              text: "편집",
              onClick: onEdit,
            },
            { text: "삭제", onClick: onDelete },
          ]}
        />
      </div>
    </div>
  );
};
