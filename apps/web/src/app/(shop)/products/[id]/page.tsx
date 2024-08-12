"use client";

import {
  BadgeInfluencer,
  BadgeNew,
  BadgeSoldOut,
  BadgeThumnbsUp,
  Badges,
} from "@/components/badge";
import { FoodStyle } from "@/components/food-style";
import { Nav } from "@/components/nav";
import { Page } from "@/components/page";
import { ProductPrice } from "@/components/product-price";
import { QuantityManage } from "@/components/quantity-manage";
import { Tabs } from "@/components/tabs";
import Image from "next/image";
import { Description } from "./description";
import { Ingredient } from "./ingredient";
import { HowtoEat } from "./howtoeat";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/button";
import { ProductOptions } from "@/components/product-options";
import { useParams, useRouter } from "next/navigation";
import { useLang } from "@/hooks/use-lang";
import useSWR from "swr";
import { apiClient } from "@hackathon-qrmenu/api-client";
import {
  Currency,
  LangCode,
  Menu,
  MenuBadge,
  MenuFoodStyle,
  OptionGroup,
  Unit,
} from "@hackathon-qrmenu/type";
import { useTranslation } from "react-i18next";
import { ImageSlider } from "./images";
import { useRate } from "@/hooks/use-rate";
import { useCurrency } from "@/hooks/use-currency";
import { formatNumber, toImperial } from "@/utils";
import { useUnit } from "@/hooks/use-unit";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useCart } from "@/hooks/use-cart";

export interface MenuForm {
  optionGroups: OptionGroup[];
}

export default function Product() {
  const [index, setIndex] = useState(0);

  const { id: menuId } = useParams();
  const langCode = useLang();
  useEffect(() => {
    fetchRef.current = false;
  }, [langCode]);
  const router = useRouter();
  const getMenu = useSWR(
    menuId ? { url: `/menu/menus/${menuId}`, params: { langCode } } : null,
    (arg) => apiClient.get<{ menu: Menu }>(arg.url, { params: arg.params }),
    {
      onError: () => {
        alert("Failed to fetch menu");
        router.back();
      },
    }
  );

  const { t } = useTranslation();

  const menu = useMemo(() => {
    if (getMenu.data?.data.menu) {
      return getMenu.data.data.menu;
    }

    return null;
  }, [getMenu.data]);

  const currency = useCurrency();
  const { cacaulate } = useRate(currency);

  const defaultOptionItem = useMemo(() => {
    return menu?.optionGroups.find((x) => x.isDefault)?.items[0] || null;
  }, [menu]);

  const unit = useUnit();

  const [quantity, setQuantity] = useState(1);

  const form = useForm<MenuForm>({ defaultValues: { optionGroups: [] } });

  const fetchRef = useRef(false);

  useEffect(() => {
    if (!menu || fetchRef.current) return;

    form.setValue(
      "optionGroups",
      menu.optionGroups.map((x) => {
        return {
          ...x,
          items: x.items.map((z, i) => ({
            ...z,
            selected: x.isRequired && i === 0 ? true : false,
          })),
        };
      })
    );

    fetchRef.current = true;
  }, [menu]);

  const groups = form.watch("optionGroups");

  const totalKRW = useMemo(() => {
    return (
      groups.reduce(
        (p, c) =>
          p +
          c.items
            .filter((z) => z.selected)
            .reduce((c, p) => c + (p.quantity || 1) * p.price, 0),
        0
      ) * quantity
    );
  }, [groups, quantity]);

  const cart = useCart();
  
  const guideExist = useMemo(() => {
    const span = document.createElement("span");
    span.innerHTML = menu?.translate?.guide || "";

    return !!span.textContent;
  }, [menu?.translate?.guide]);

  return (
    <FormProvider {...form}>
      <>
        <Page nav={<Nav back />}>
          <div className="bg-white">
            {/** Image */}

            <ImageSlider images={getMenu.data?.data.menu.images ?? []} />

            <div className="p-4 flex flex-col border-b-[4px] border-[#eee]">
              {menu?.badges && (
                <Badges>
                  {menu.badges.includes(MenuBadge.Rec) && <BadgeThumnbsUp />}
                  {menu.badges.includes(MenuBadge.New) && <BadgeNew />}
                  {menu.badges.includes(MenuBadge.Influencer) && (
                    <BadgeInfluencer />
                  )}
                </Badges>
              )}

              <span className="text-[24px] font-extrabold mt-4">
                {menu?.translate.name}
                {defaultOptionItem?.weight ? (
                  <>
                    {unit === Unit.Imperial ? (
                      <span className="text-[#999] text-[14px] ml-1">
                        (
                        {defaultOptionItem?.unit &&
                          toImperial(
                            defaultOptionItem.unit,
                            defaultOptionItem?.weight || 0
                          )}
                        )
                      </span>
                    ) : (
                      <span className="text-[#999] text-[14px] ml-1">
                        ({formatNumber(defaultOptionItem?.weight || 0)}
                        {defaultOptionItem?.unit})
                      </span>
                    )}
                  </>
                ) : (
                  ""
                )}
              </span>

              <span className="text-[24px] font-extrabold">
                {menu?.translateKR?.name}
                {defaultOptionItem?.weight ? (
                  <>
                    {unit === Unit.Imperial ? (
                      <span className="text-[#999] text-[14px] ml-1">
                        ({formatNumber(defaultOptionItem?.weight || 0)}
                        {defaultOptionItem?.unit})
                      </span>
                    ) : (
                      <span className="text-[#999] text-[14px] ml-1">
                        (
                        {defaultOptionItem?.unit &&
                          toImperial(
                            defaultOptionItem.unit,
                            defaultOptionItem?.weight || 0
                          )}
                        )
                      </span>
                    )}
                  </>
                ) : (
                  ""
                )}
              </span>

              {/**  <div className="mt-3">
              <BadgeAdult />
            </div>*/}

              <div className="flex mt-2.5 justify-between items-start">
                {menu?.isSoldOut && <BadgeSoldOut />}

                <div className="flex flex-col items-end">
                  <ProductPrice
                    soldout={menu?.isSoldOut || false}
                    price={defaultOptionItem?.price || 0}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border-b-[4px] border-[#eee]">
              <span className="font-bold text-[16px]">{t("quantity")}</span>
              <QuantityManage
                quantity={quantity}
                onDecrease={() => setQuantity((prev) => prev - 1)}
                onIncrease={() => setQuantity((prev) => prev + 1)}
              />
            </div>

            <div className="pb-4 border-b-[4px] border-[#eee]">
              <ProductOptions />
            </div>

            {/** Food Style */}
            {(menu?.foodStyles.length || 0) >= 1 && (
              <div className="p-4 border-b-[4px] border-[#eee]">
                <span className="font-bold text-[16px]">{t("food-style")}</span>

                <div className="grid grid-cols-4 mt-5 gap-y-5">
                  {menu?.foodStyles.includes(MenuFoodStyle.Halal) && (
                    <FoodStyle
                      icon={
                        <Image
                          src="/halal.png"
                          width={30}
                          height={19}
                          alt="Vegan"
                        />
                      }
                      label={
                        <>
                          {t("halal")}
                          <br />
                          {t("certified")}
                        </>
                      }
                    />
                  )}

                  {menu?.foodStyles.includes(MenuFoodStyle.Vege) && (
                    <FoodStyle
                      icon={
                        <Image
                          src="/vegan.png"
                          width={30}
                          height={30}
                          alt="Vegan"
                        />
                      }
                      label={<>{t(MenuFoodStyle.Vege)}</>}
                    />
                  )}

                  {menu?.foodStyles.includes(MenuFoodStyle.Began) && (
                    <FoodStyle
                      icon={
                        <Image
                          src="/vegan.png"
                          width={30}
                          height={30}
                          alt="Vegan"
                        />
                      }
                      label={<>{t(MenuFoodStyle.Began)}</>}
                    />
                  )}

                  {menu?.foodStyles.includes(MenuFoodStyle.Lacto) && (
                    <FoodStyle
                      icon={
                        <Image
                          src="/lacto.png"
                          width={21}
                          height={30}
                          alt="Vegan"
                        />
                      }
                      label={<>{t(MenuFoodStyle.Lacto)}</>}
                    />
                  )}

                  {menu?.foodStyles.includes(MenuFoodStyle.Ovo) && (
                    <FoodStyle
                      icon={
                        <Image
                          src="/obo.png"
                          width={27}
                          height={27}
                          alt="Vegan"
                        />
                      }
                      label={<>{t(MenuFoodStyle.Ovo)}</>}
                    />
                  )}

                  {menu?.foodStyles.includes(MenuFoodStyle.LactoOvo) && (
                    <FoodStyle
                      icon={
                        <Image
                          src="/lactoobo.png"
                          width={64}
                          height={64}
                          alt="Vegan"
                        />
                      }
                      label={<>{t(MenuFoodStyle.LactoOvo)}</>}
                    />
                  )}

                  {menu?.foodStyles.includes(MenuFoodStyle.Pesco) && (
                    <FoodStyle
                      icon={
                        <Image
                          src="/pesco.png"
                          width={30}
                          height={15}
                          alt="Vegan"
                        />
                      }
                      label={<>{t(MenuFoodStyle.Pesco)}</>}
                    />
                  )}

                  {menu?.foodStyles.includes(MenuFoodStyle.Pollo) && (
                    <FoodStyle
                      icon={
                        <Image
                          src="/polo.png"
                          width={27}
                          height={25}
                          alt="Vegan"
                        />
                      }
                      label={<>{t(MenuFoodStyle.Pollo)}</>}
                    />
                  )}
                </div>
              </div>
            )}

            <div className="border-b-[2px] border-[#f1f1f1]">
              <Tabs
                tabs={
                  [
                    t("description"),
                    t("ingredient"),
                    guideExist ? t("how-to-eat") : false,
                  ].filter((z) => z) as any
                }
                index={index}
                onChange={setIndex}
              />
            </div>

            {menu && (
              <div className="mt-2.5">
                {index === 0 && <Description menu={menu} />}
                {index === 1 && <Ingredient menu={menu} />}
                {index === 2 && <HowtoEat menu={menu} />}
              </div>
            )}
          </div>
        </Page>

        <div className="h-[52px]" />
        <Button
          disabled={menu?.isSoldOut}
          type="button"
          className={`!h-[52px] flex items-center font-extrabold justify-center fixed bottom-0 left-0 right-0 rounded-none disabled:bg-[#ccc]`}
          onClick={(e) => {
            if (!menu) return;
            cart.append(menu, groups, quantity);
          }}
        >
          <Image
            src="/cart.png"
            width={16}
            height={16}
            alt="Cart"
            className="mr-2"
          />
          {t("add-to-cart")} ({Currency.KRW} {formatNumber(totalKRW)} /{" "}
          {currency} {cacaulate(totalKRW)})
        </Button>
      </>
    </FormProvider>
  );
}
