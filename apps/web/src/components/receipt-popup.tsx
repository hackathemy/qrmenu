"use client";

import { CartItem } from "@hackathon-qrmenu/store";
import { Button } from "./button";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { formatNumber } from "@/utils";

export const ReceiptPopup = ({
  onClose,
  items,
  totalKRW,
}: {
  items: CartItem[];
  totalKRW: number;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="fixed left-0 right-0 bottom-0 top-0 z-50 flex bg-[rgba(0,0,0,0.7)] flex-col">
      <div className="my-auto rounded-2xl bg-white p-2 self-stretch mx-5 flex flex-col items-center relative">
        <button className="self-end w-6 h-6 flex" onClick={onClose}>
          <Image
            src="/close.png"
            alt="Del"
            width={12}
            height={12}
            className="m-auto"
          />
        </button>

        <h3 className="font-extrabold text-[24px]/[34px] mt-6 mb-4">주문표</h3>

        <div className="flex flex-col bg-[#f5f5f5] self-stretch p-4 rounded-2xl mx-3  max-h-[50vh] overflow-y-auto">
          {items.map((x, i) => {
            return (
              <div
                key={i}
                className="flex flex-col pb-5 border-b-[1px] border-b-[#eee] mb-5"
              >
                <span className="font-bold text-[16px] mb-3">
                  {i + 1}. {x.menu.translateKR.name} *{x.quantity}
                </span>

                {x.options
                  .map(
                    (x) =>
                      `${x.translateKR?.name}: ${x.items
                        .filter((z) => z.selected)
                        .map(
                          (z) =>
                            `${z.translateKR?.name} ${
                              (z.quantity || 1) > 1 ? ` *${z.quantity}` : ""
                            }`
                        )
                        .join(", ")}`
                  )
                  .map((x, i) => {
                    return (
                      <span
                        key={i}
                        className="text-[14px]/[18px] before:content-['•'] before:absolute relative before:-left-4 ml-6"
                      >
                        {x}
                      </span>
                    );
                  })}

                <span className="self-end font-bold text-[16px] mt-3">
                  {formatNumber(
                    x.options.reduce(
                      (p, c) =>
                        p +
                        c.items
                          .filter((z) => z.selected)
                          .reduce((c, p) => c + (p.quantity || 1) * p.price, 0),
                      0
                    ) * x.quantity
                  )}
                  원
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between self-stretch mb-3 mx-4 mt-5">
          <span className="text-[#666]">총 개수</span>
          <span className="text-[16px] font-bold">{items.length}개</span>
        </div>

        <div className="flex items-center justify-between self-stretch mb-3 mx-4">
          <span className="text-[#161414]">총 금액</span>
          <span className="text-[16px] font-bold">
            {formatNumber(totalKRW)}원
          </span>
        </div>

        <Button
          onClick={onClose}
          className="mx-3 my-3 mt-4 self-stretch font-bold"
        >
          닫기
        </Button>
      </div>
    </div>
  );
};
