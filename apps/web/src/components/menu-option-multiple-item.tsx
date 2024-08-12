"use client";

import Image from "next/image";
import { useCurrency } from "@/hooks/use-currency";
import { useRate } from "@/hooks/use-rate";
import { Currency, MenuUnit, Unit } from "@hackathon/type";
import { formatNumber, toImperial } from "@/utils";
import { ReactNode } from "react";
import { useUnit } from "@/hooks/use-unit";

export const MenuOptionMultipleItem = ({
  selected,
  nameKO,
  name,
  unit,
  weight,
  price,
  onClick,
  quantityComponent,
}: {
  unit?: string;
  selected: boolean;
  name: string;
  weight?: number;
  nameKO: string;
  onClick: () => void;
  price: number;
  quantityComponent: ReactNode;
}) => {
  const currency = useCurrency();
  const { cacaulate } = useRate(currency);

  const systemUnit = useUnit();
  return (
    <div className="flex items-center mb-5 last-of-type:mb-0">
      <div onClick={onClick} className="cur-pointer flex flex-1">
        <div className="flex w-[20px] h-[20px]">
          <div className="m-auto">
            {selected ? (
              <Image src="/check-on.png" width={15} height={15} alt="Radio" />
            ) : (
              <Image src="/check-off.png" width={15} height={15} alt="Radio" />
            )}
          </div>
        </div>

        <div className="flex flex-col items-start mx-2 flex-1 text-[12px] text-[#666]">
          <p className="font-bold text-[12px]">
            {name}
            {weight ? (
              <>
                {systemUnit === Unit.Imperial ? (
                  <span className="text-[#999] text-[14px] ml-1">
                    ({unit && toImperial(unit as MenuUnit, weight || 0)})
                  </span>
                ) : (
                  <span className="text-[#999] text-[14px] ml-1">
                    ({formatNumber(weight || 0)}
                    {unit})
                  </span>
                )}
              </>
            ) : (
              ""
            )}
          </p>

          <div>
            {nameKO}
            {weight ? (
              <>
                {systemUnit === Unit.Imperial ? (
                  <span className="text-[#999] text-[14px] ml-1">
                    ({formatNumber(weight || 0)}
                    {unit})
                  </span>
                ) : (
                  <span className="text-[#999] text-[14px] ml-1">
                    ({unit && toImperial(unit as MenuUnit, weight || 0)})
                  </span>
                )}
              </>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 items-start">
          {price === 0 ? (
            <span className="text-[12px] font-bold">0</span>
          ) : (
            <span className="text-[12px] font-bold">
              + {Currency.KRW} {formatNumber(price)}
            </span>
          )}

          {price === 0 ? (
            <span className="text-[12px] text-[#666]">Free</span>
          ) : (
            <span className="text-[12px] text-[#666]">
              ({currency} {cacaulate(price)})
            </span>
          )}
        </div>
      </div>

      <div className="items-end flex flex-col">{quantityComponent}</div>
    </div>
  );
};
