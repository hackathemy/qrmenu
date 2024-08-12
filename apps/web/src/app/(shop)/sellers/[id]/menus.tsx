import { Button } from "@/components/button";
import { MenuItem } from "@/components/menu-item";
import { useLang } from "@/hooks/use-lang";
import { apiClient } from "@hackathon-qrmenu/api-client";
import { Category, Menu } from "@hackathon-qrmenu/type";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";

export const Menus = ({}) => {
  const { id: sellerId } = useParams();
  const langCode = useLang();

  const listCategories = useSWR(
    sellerId
      ? {
          url: `/menu/categories`,
          params: {
            langCode,
            sellerId,
            pageOffset: 0,
            pageLimit: 10000000,
            isPrivate: "0",
          },
        }
      : null,
    (arg) =>
      apiClient.get<{ categories: Category[] }>(arg.url, { params: arg.params })
  );
  const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(
    null
  );

  const fix_top = 52 + 52 + 60;

  useEffect(() => {
    if (listCategories.data?.data.categories.length) {
      const listener = () => {
        const categoryDivs = listCategories.data?.data.categories.map((x) =>
          document.getElementById(`category-${x.id}`)
        );

        for (let category of (categoryDivs || []).reverse()) {
          const offsetTop = category?.offsetTop || 0;

          if (window.scrollY + fix_top >= offsetTop) {
            setCurrentCategoryId(
              parseInt(category?.id.replace("category-", "") || "")
            );
            console.log("current category: ", category?.id);
            break;
          }
        }
      };
      setCurrentCategoryId(listCategories.data.data.categories[0].id);
      window.addEventListener("scroll", listener);
      return () => {
        window.removeEventListener("scroll", listener);
      };
    }
  }, [listCategories.data?.data.categories]);

  const buttonScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentCategoryId) {
      buttonScrollRef.current?.scrollTo({
        behavior: "smooth",
        left:
          document.getElementById(`category-button-${currentCategoryId}`)
            ?.offsetLeft - 20,
      });
    }
  }, [currentCategoryId]);

  return (
    <>
      <div className="sticky  h-[60px] left-0 right-0 py-3 top-[calc(52px_+_52px)] z-10 bg-[#f1f1f1]">
        <div
          className="flex items-center overflow-x-auto scrollbar-hide"
          ref={buttonScrollRef}
        >
          {listCategories.data?.data.categories.map((x) => (
            <Button
              id={`category-button-${x.id}`}
              onClick={() => {
                window.scrollTo({
                  behavior: "smooth",
                  top:
                    (document.getElementById(`category-${x.id}`)?.offsetTop ||
                      0) - fix_top,
                });
              }}
              key={x.id}
              className={`first-of-type:ml-2 whitespace-nowrap !rounded-xl font-bold !h-11 mr-2 ${
                currentCategoryId !== x.id && "!bg-white !text-[#999]"
              }`}
            >
              {x.translate.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="px-3 mt-6 flex flex-col">
        {listCategories.data?.data.categories.map((category) => {
          return <CategoryMenus category={category} />;
        })}
      </div>
    </>
  );
};

const CategoryMenus = ({ category }: { category: Category }) => {
  const langCode = useLang();
  const { id: sellerId } = useParams();

  const listMenus = useSWR(
    {
      url: `/menu/menus`,
      params: {
        langCode,
        categoryId: category.id,
        sellerId,
        pageOffset: 0,
        pageLimit: 10000000,
      },
    },
    (arg) => apiClient.get<{ menus: Menu[] }>(arg.url, { params: arg.params })
  );

  return (
    <div className="mb-3" id={`category-${category.id}`}>
      <h3 className="font-extrabold text-[20px]/[28px] mb-5">
        {category.translate.name}
      </h3>
      {listMenus.data?.data.menus.map((x) => <MenuItem menu={x} />)}
    </div>
  );
};
