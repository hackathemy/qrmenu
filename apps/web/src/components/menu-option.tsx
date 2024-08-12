'use client'

import { ReactNode } from "react";

export const MenuOption = ({
  option,
  required,
  children,
}: {
  children?: ReactNode;
  option: string;
  required?: boolean;
}) => {
  return (
    <div className="mx-4 py-5 flex flex-col border-b-[1px] border-[#eee] last-of-type:border-b-[0px]">
      <div className="flex items-center mb-5">
        <span className="font-bold text-[16px]">{option}</span>
        {required && (
          <span className="text-[14px] text-[#ff5c00] ml-1">(*Requires)</span>
        )}
      </div>
      {children}
    </div>
  );
};
