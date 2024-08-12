"use client";

import { Button } from "./button";
import Image from "next/image";
import { QuantityManage } from "./quantity-manage";
import { ProductPrice } from "./product-price";
import { ProductOptions } from "./product-options";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { CartItem as CartItemT } from "@hackathon-qrmenu/store";
import { useMemo } from "react";
import { CartProductOptions } from "./cart-product-options";
import { getCDNUrl } from "@/utils";

export const ChangeOptionPopup = ({
  onClose,
  index,
}: {
  onClose?: () => void;
  index: number;
}) => {
  const { t } = useTranslation();

  const parentForm = useFormContext<{ items: CartItemT[] }>();

  const form = useForm<CartItemT>({
    defaultValues: parentForm.getValues(`items.${index}`),
  });

  const { menu, quantity, options } = form.watch();

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
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          parentForm.setValue(`items.${index}`, data);
          onClose && onClose();
        })}
      >
        <div className="fixed left-0 right-0 bottom-0 top-0 z-50 flex bg-[rgba(0,0,0,0.7)] flex-col">
          <div className="my-auto rounded-2xl bg-white self-stretch mx-5 flex flex-col">
            <button className="m-2 self-end w-6 h-6 flex" onClick={onClose}>
              <Image
                src="/close.png"
                alt="Del"
                width={12}
                height={12}
                className="m-auto"
              />
            </button>

            <div className="flex mt-2 px-4 items-center self-stretch py-4 border-b-[4px] border-[#eee]">
              <div className="w-[96px] h-[96px] rounded-md relative overflow-hidden">
                <Image
                  src={getCDNUrl(menu.images[0].image.key)}
                  alt="Test"
                  fill
                />
              </div>
              <span className="flex flex-1 font-extrabold text-[24px] ml-3">
                {menu.translate.name}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 border-b-[4px] border-[#eee]">
              <span className="font-bold text-[16px]">{t("quantity")}</span>
              <QuantityManage
                quantity={quantity}
                onDecrease={() => {
                  form.setValue(`quantity`, quantity - 1);
                }}
                onIncrease={() => {
                  form.setValue(`quantity`, quantity + 1);
                }}
              />
            </div>

            <div className="flex items-center justify-between p-4 border-b-[4px] border-[#eee]">
              <span className="font-bold text-[16px]">{t("price")}</span>
              <div className="flex flex-col items-end">
                <ProductPrice price={totalKRW} />
              </div>
            </div>

            <div className="border-b-[4px] border-[#eee] max-h-[40vh] overflow-y-auto pb-5">
              <CartProductOptions index={index} />
            </div>

            <div className="grid grid-cols-2 gap-x-2 p-4">
              <Button
                onClick={onClose}
                className="font-bold !bg-[#ccc]"
                type="button"
              >
                {t("cancel")}
              </Button>
              <Button className="font-bold">{t("apply-changes")}</Button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
