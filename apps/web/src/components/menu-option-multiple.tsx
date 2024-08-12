'use client'

import { ReactNode } from "react";

export const MenuOptionMultiple = ({
  option,
  optional,
  children,
}: {
  children?: ReactNode;
  option: string;
  optional?: boolean;
}) => {
  return (
    <div className="mx-4 rounded-xl flex flex-col bg-[#f5f5f5] mb-2 last-of-type:mb-0 p-3">
      <div className="flex items-center mb-5">
        <span className="font-bold text-[16px]">{option}</span>
        {optional && (
          <span className="text-[14px] text-[#999] ml-1">(*Optional)</span>
        )}
      </div>
      {children}
    </div>
  );
};
