"use client";

import { useCurrency } from "@/hooks/use-currency";
import { useRate } from "@/hooks/use-rate";
import { useUnit } from "@/hooks/use-unit";
import { formatNumber, toImperial } from "@/utils";
import { Currency, MenuUnit, Unit } from "@hackathon-qrmenu/type";
import Image from "next/image";

export const MenuOptionItem = ({
  selected,
  nameKO,
  name,
  unit,
  price,
  weight,
  onClick,
}: {
  selected: boolean;
  name: string;
  nameKO: string;
  unit?: string;
  weight?: number;
  onClick: () => void;
  price: number;
}) => {
  const currency = useCurrency();
  const { cacaulate } = useRate(currency);
  const systemUnit = useUnit();

  return (
    <div className="py-5 flex items-center cursor-pointer" onClick={onClick}>
      <div className="flex w-6 h-6">
        <div className="m-auto">
          {selected ? (
            <Image src="/radio-on.png" width={18} height={18} alt="Radio" />
          ) : (
            <Image src="/radio-off.png" width={18} height={18} alt="Radio" />
          )}
        </div>
      </div>

      <div className="flex flex-col mx-2 flex-1">
        <div>
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
        </div>
        {name !== nameKO && (
          <>
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
          </>
        )}
      </div>
      <div className="text-right flex flex-col">
        {price === 0 ? (
          <span className="text-[#ff5c00] font-bold">0</span>
        ) : (
          <span className="text-[#ff5c00] font-bold">
            + {Currency.KRW} {formatNumber(price)}
          </span>
        )}
        {price === 0 ? (
          <span className="text-[12px] font-bold">Free</span>
        ) : (
          <span className="text-[12px] font-bold">
            (+ {currency} {cacaulate(price)})
          </span>
        )}
      </div>
    </div>
  );
};
