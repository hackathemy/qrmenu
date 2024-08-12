"use client";

import Image from "next/image";
import { BadgeInfluencer, BadgeNew, BadgeThumnbsUp, Badges } from "./badge";
import { ProductInfo } from "./product-info";
import { QuantityManage } from "./quantity-manage";
import { ProductPrice } from "./product-price";
import { Menu, MenuBadge, Currency, OptionGroup } from "@hackathon/type";
import { getCDNUrl, formatNumber } from "@/utils";
import { useFormContext } from "react-hook-form";
import { CartItem as CartItemT } from "@hackathon/store";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
export const CartItem = ({
  onChangeOption,
  index,
  onRemove,
}: {
  onRemove: () => void;
  index: number;
  onChangeOption?: () => void;
}) => {
  const { t } = useTranslation();
  const form = useFormContext<{ items: CartItemT[] }>();
  const { menu, quantity, checked, options } = form.watch(`items.${index}`);

  const totalKRW = useMemo(() => {
    return (
      options.reduce(
        (p, c) =>
          p +
          c.items
            .filter((z) => z.selected)
            .reduce((c, p) => c + (p.quantity || 1) * p.price, 0),
        0
      ) * quantity
    );
  }, [options, quantity]);

  return (
    <div className="border-b-[1px] border-b-[#eee] pb-5 mb-5 last-of-type:mb-0">
      <div className="flex flex-col">
        {/** Header */}
        <div className="flex items-center">
          <button
            type="button"
            className="w-5 h-5 flex"
            onClick={(e) => {
              form.setValue(`items.${index}.checked`, !checked);
            }}
          >
            {checked}
            <Image
              alt="Check"
              src={checked ? "/check-on.png" : "/check-off.png"}
              width={15}
              height={15}
              className="m-auto"
            />
          </button>

          <div className="ml-auto">
            <Badges>
              {menu.badges.includes(MenuBadge.New) && <BadgeNew />}
              {menu.badges.includes(MenuBadge.Rec) && <BadgeThumnbsUp />}
              {menu.badges.includes(MenuBadge.Influencer) && (
                <BadgeInfluencer />
              )}
            </Badges>
          </div>

          <button
            className="w-6 h-6 flex ml-5"
            onClick={onRemove}
            type="button"
          >
            <Image
              alt="Check"
              src={"/trash.png"}
              width={20}
              height={20}
              className="m-auto"
            />
          </button>
        </div>

        {/** Info */}
        <div className="flex mt-3">
          <div className="w-[96px] h-[96px] rounded-md relative overflow-hidden">
            <Image src={getCDNUrl(menu.images[0].image.key)} alt="Test" fill />
          </div>
          <div className="ml-3 flex-1">
            <ProductInfo
              name={menu.translate.name}
              description={menu.translate.description}
            />
          </div>
        </div>

        {/** Option */}
        <div className="my-5 flex flex-col">
          {options
            .map(
              (x) =>
                `${x.translate?.name}: ${x.items
                  .filter((z) => z.selected)
                  .map(
                    (z) =>
                      `${z.translate?.name} (${Currency.KRW} ${formatNumber(
                        z.price
                      )})${(z.quantity || 1) > 1 ? ` *${z.quantity}` : ""}`
                  )
                  .join(", ")}`
            )
            .map((x, i) => {
              return (
                <span
                  key={i}
                  className="text-[14px]/[24px] before:content-['•'] before:absolute relative before:-left-4 ml-6"
                >
                  {x}
                </span>
              );
            })}
        </div>

        {/** Footer */}
        <div className="flex items-center">
          <QuantityManage
            quantity={quantity}
            onDecrease={() => {
              form.setValue(`items.${index}.quantity`, quantity - 1);
            }}
            onIncrease={() => {
              form.setValue(`items.${index}.quantity`, quantity + 1);
            }}
          />

          <button
            type="button"
            onClick={onChangeOption}
            className="w-[104px] h-[33px] rounded-md border-[#ccc] border-[1px] text-center font-bold text-[12px] ml-6"
          >
            {t("change-option")}
          </button>

          <div className="flex flex-col ml-auto items-end">
            <ProductPrice price={totalKRW} />
          </div>
        </div>
      </div>
    </div>
  );
};
