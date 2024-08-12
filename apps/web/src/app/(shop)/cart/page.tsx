"use client";

import { Button } from "@/components/button";
import { CartItem } from "@/components/cart-item";
import { ChangeOptionPopup } from "@/components/change-option-popup";
import { Nav } from "@/components/nav";
import { Page } from "@/components/page";
import { ProductPrice } from "@/components/product-price";
import { ReceiptPopup } from "@/components/receipt-popup";
import { useLang } from "@/hooks/use-lang";
import { apiClient } from "@hackathon-qrmenu/api-client";
import {
  CartItem as CartItemT,
  useCartStore,
  useViewSellerStore,
} from "@hackathon-qrmenu/store";
import { Menu } from "@hackathon-qrmenu/type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export default function CartPage() {
  const router = useRouter();

  const setItems = useCartStore((s) => s.setItems);

  const [receipt, setReceipt] = useState(false);
  const [changeOption, setChangeOption] = useState<number | null>(null);
  const { t } = useTranslation();

  const form = useForm<{ items: CartItemT[] }>({
    defaultValues: { items: [] },
  });

  const itemsFieldArray = useFieldArray({
    control: form.control,
    name: "items",
  });

  const langCode = useLang();

  useEffect(() => {
    const items = useCartStore.getState().items;

    Promise.all(
      items.map((x) =>
        apiClient.get<{ menu: Menu }>(`/menu/menus/${x.menu.id}`, {
          params: { langCode },
        })
      )
    ).then((menus) => {
      const newItems = [
        ...items.map((x) => {
          const newMenu = menus.find((z) => z.data.menu.id === x.menu.id)?.data
            ?.menu;
          if (newMenu) {
            x.menu = newMenu;
            x.options = x.options.map((z) => {
              const fetchOptionGroup = newMenu.optionGroups.find(
                (y) => y.id === z.id
              );

              if (fetchOptionGroup) {
                z.translate = fetchOptionGroup.translate;
                z.items = z.items.map((y) => {
                  y.translate =
                    fetchOptionGroup.items.find((b) => b.id === y.id)
                      ?.translate || y.translate;
                  return y;
                });
              }

              return z;
            });
          }

          return x;
        }),
      ];
      setItems(newItems);

      form.setValue("items", newItems);
    });
  }, [langCode]);

  useEffect(() => {
    form.setValue("items", useCartStore.getState().items);
    return () => {
      setItems(form.getValues("items"));
    };
  }, []);

  const initialSellerId = useViewSellerStore((s) => s.sellerId);
  const renderAddMoreButton = useCallback(() => {
    return (
      <Button
        className="!font-bold mt-5 self-stretch !bg-white !text-[#101010] border-[1px] border-[#101010] flex items-center justify-center"
        onClick={() => {
          router.replace("/sellers/" + initialSellerId);
        }}
      >
        <Image
          src="/add-b.png"
          alt="Plus"
          width={14}
          height={14}
          className="mr-[15px]"
        />
        {t("g-a-m-i")}
      </Button>
    );
  }, [t, router, initialSellerId]);

  const renderEmpty = useCallback(() => {
    return (
      <div className="flex flex-col mt-[50%] items-center justify-center">
        <Image src="/cart-empty.png" width={200} height={180} alt="Empty" />
        <span className="mt-2 font-bold text-[16px] text-[#666]">
          {t("t-c-i-e")}
        </span>
        <div className="mx-10 mt-5 self-stretch flex flex-col">
          {renderAddMoreButton()}
        </div>
      </div>
    );
  }, [t, renderAddMoreButton]);

  const formItems = form.watch("items");

  useEffect(() => {
    setItems(formItems);
  }, [formItems]);

  const empty = formItems.length === 0;

  const totalKRW = formItems.reduce(
    (p, c) =>
      p +
      (c.checked
        ? c.options.reduce(
            (p, c) =>
              p +
              c.items
                .filter((z) => z.selected)
                .reduce((c, p) => c + (p.quantity || 1) * p.price, 0),
            0
          ) * c.quantity
        : 0),
    0
  );

  const renderCartList = useCallback(() => {
    return (
      <div>
        {itemsFieldArray.fields.map((field, index) => {
          return (
            <CartItem
              key={field.id}
              index={index}
              onRemove={() => {
                itemsFieldArray.remove(index);
              }}
              onChangeOption={() => {
                setChangeOption(index);
              }}
            />
          );
        })}
      </div>
    );
  }, [itemsFieldArray]);

  return (
    <>
      <FormProvider {...form}>
        <>
          <Page nav={<Nav back />} footerHidden bgWhite>
            <h1 className="text-[20px] font-bold m-4">
              {t("cart")}({formItems.length})
            </h1>

            {!empty && (
              <div className="bg-white p-4 flex flex-col">
                {renderCartList()}
                {renderAddMoreButton()}

                <div className="flex items-center justify-between mt-4">
                  <span className="font-extrabold text-[16px]">
                    {t("t-o-a")}({formItems.filter((x) => x.checked).length})
                  </span>
                  <div className="flex flex-col items-end">
                    <ProductPrice price={totalKRW} large />
                  </div>
                </div>
              </div>
            )}
            {empty && renderEmpty()}
          </Page>

          {changeOption !== null && (
            <ChangeOptionPopup
              index={changeOption}
              onClose={() => {
                setChangeOption(null);
              }}
            />
          )}

          {!empty && (
            <>
              <div className="h-[52px]" />
              <Button
                className="!h-[52px] flex items-center font-extrabold justify-center fixed bottom-0 left-0 right-0 rounded-none"
                onClick={(e) => {
                  setReceipt(true);
                }}
              >
                {t("s-i-t-t-s")}
              </Button>
            </>
          )}
        </>
      </FormProvider>
      {receipt && (
        <ReceiptPopup
          totalKRW={totalKRW}
          items={formItems.filter((x) => x.checked)}
          onClose={() => {
            setReceipt(false);
          }}
        />
      )}
    </>
  );
}
