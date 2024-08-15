import Image from "next/image";
import { Button } from "./button";
import Link from "next/link";
import {
  BadgeInfluencer,
  BadgeNew,
  BadgeSoldOut,
  BadgeThumnbsUp,
  Badges,
} from "./badge";
import { ProductPrice } from "./product-price";
import { ProductInfo } from "./product-info";
import { Menu, MenuBadge } from "@hackathemy-qrmenu/type";
import { getCDNUrl } from "@/utils";
import { useTranslation } from "react-i18next";
import { useCart } from "@/hooks/use-cart";

export const MenuItem = ({ menu }: { menu: Menu }) => {
  const { t } = useTranslation();
  const cart = useCart();

  if (!menu) return null;
  return (
    <Link href={"/products/" + menu.id}>
      <div className="bg-white rounded-xl mb-3 shadow-sm">
        <div className="p-4 flex items-stretch">
          <div className="flex flex-col">
            <div className="w-[96px] h-[96px] relative">
              <Image
                src={getCDNUrl(menu.images[0]?.image?.key || "")}
                alt="Test"
                fill
                className="rounded-md"
              />
            </div>

            <ProductPrice
              soldout={menu.isSoldOut}
              price={
                menu.optionGroups.find((x) => x.isDefault)?.items[0].price || 0
              }
            />
          </div>

          <div className="flex flex-col flex-1 ml-3">
            <Badges>
              {menu.badges.includes(MenuBadge.New) && <BadgeNew />}
              {menu.badges.includes(MenuBadge.Rec) && <BadgeThumnbsUp />}
              {menu.badges.includes(MenuBadge.Influencer) && (
                <BadgeInfluencer />
              )}
            </Badges>

            <ProductInfo
              name={menu.translate.name}
              description={menu.translate.description}
            />

            <div className="mt-auto self-stretch flex flex-col">
              {menu.isSoldOut && (
                <div className="self-end">
                  <BadgeSoldOut />
                </div>
              )}

              {!menu.isSoldOut && (
                <Button
                  className="!h-9 flex items-center font-extrabold justify-center"
                  onClick={(e) => {
                    //                    e.stopPropagation();
                    //                    e.preventDefault();
                    //                    cart.append(menu, []);
                  }}
                  type="button"
                >
                  <Image
                    src="/cart.png"
                    width={16}
                    height={16}
                    alt="Cart"
                    className="mr-2"
                  />
                  {t("add-to-cart")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
