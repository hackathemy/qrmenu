"use client";

import { formatNumber } from "@/utils";
import Image from "next/image";

const buttonClassName = "w-6 h-6 flex items-center justify-center";

export const QuantityManage = ({
  quantity,
  onIncrease,
  onDecrease,
  quantityMax,
  disabled,
}: {
  disabled?: boolean;
  quantityMax?: number;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}) => {
  return (
    <div className="flex items-center">
      <button
        disabled={disabled || quantity === 0}
        className={buttonClassName}
        type="button"
        onClick={(e) => {
          onDecrease();
        }}
      >
        <Image src="/q-minus.png" width={20} height={20} alt="Q Minus" />
      </button>

      <span className="text-center font-extrabold text-[16px] min-w-[40px]">
        {formatNumber(quantity) || 0}
      </span>

      <button
        disabled={disabled || !!(quantityMax && quantity >= quantityMax)}
        className={buttonClassName}
        type="button"
        onClick={(e) => {
          onIncrease();
        }}
      >
        <Image src="/q-plus.png" width={20} height={20} alt="Q Plus" />
      </button>
    </div>
  );
};
