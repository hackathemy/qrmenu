"use client";

import { useCurrency } from "@/hooks/use-currency";
import { useRate } from "@/hooks/use-rate";
import { formatNumber } from "@/utils";
import { Currency, LangCode } from "@hackathon-qrmenu/type";

export const ProductPrice = ({
  soldout,
  large,
  price,
}: {
  price: number;
  soldout?: boolean;
  large?: boolean;
}) => {
  const currency = useCurrency();
  const { cacaulate } = useRate(currency);
  return (
    <>
      <span
        className={`self-start mt-1 font-extrabold ${
          large ? "text-[20px]" : "text-[16px]"
        } ${soldout && "!text-[#999]"} relative`}
      >
        <span
          className={`font-extrabold ${large ? "text-[14px]" : "text-[12px]"} ${
            soldout && "!text-[#999]"
          }`}
        >
          {Currency.KRW}
        </span>{" "}
        {formatNumber(price)}
        {soldout && (
          <div className="absolute left-0 right-0 h-[1px] bg-[#999] top-[55%]" />
        )}
      </span>

      <span
        className={`self-start relative text-[#666] ${
          large ? "text-[16px]" : "text-[12px]"
        } font-light ${soldout && "!text-[#999]"}`}
      >
        <span
          className={`${large ? "text-[12px]" : "text-[10px]"} font-light ${
            soldout && "!text-[#999]"
          }`}
        >
          {currency}
        </span>{" "}
        {cacaulate(price)}
        {soldout && (
          <div className="absolute left-0 right-0 h-[1px] bg-[#999] top-[55%]" />
        )}
      </span>
    </>
  );
};
