import { Tooltip } from "@/components/tooltip";
import { MenuList } from "@/components/menu-list";
import Link from "next/link";
import { SmallBorderButton } from "@/components/small-border-button";
import { useCategories } from "@/hooks/use-categories";
import { useLang } from "@/hooks/use-lang";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { LangCode } from "@hackathon-qrmenu/type";

export const BestMenuList = () => {
  const langCode = useLang();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category_id") || "";

  const { data, isLoading, error, mutate } = useCategories(langCode);

  const category = useMemo(() => {
    if (data?.data?.categories && categoryId) {
      return data.data.categories.find((x) => x.id === parseInt(categoryId));
    }
    return null;
  }, [data, categoryId]);

  if (!category)
    return (
      <p className="text-center text-[#999] text-[14px] mt-[55px]">
        선택된 카테고리가 없습니다.
        <br />
        카테고리를 선택해 주세요.
      </p>
    );

  return (
    <>
      <div className="flex items-center justify-between max-[1440px]:mt-5">
        <span className="font-bold flex items-center">
          {category?.translate?.name} 메뉴 목록
          {category?.menuTotalSize ? ` (${category?.menuTotalSize}개)` : ""}
          <Tooltip
            message={
              <>
                <span className="text-[14px]/[20px] text-[#666] before:content-['•'] before:absolute relative before:-left-4 ml-6 block">
                  메뉴의 상태를 [품절]로 변경하면 다른 카테고리에 있는 동일한
                  메뉴의 상태도 [품절]로 동일하게 변경됩니다.
                </span>
                <span className="text-[14px]/[20px] text-[#666] before:content-['•'] before:absolute relative before:-left-4 ml-6">
                  비공개 메뉴는 해당 리스트에서 노출되지 않습니다.
                </span>
                <br />
              </>
            }
          />
        </span>
        {langCode === LangCode.KO && (
          <Link href={"/menus/create?category_id=" + (category?.id || "")}>
            <SmallBorderButton>메뉴 추가</SmallBorderButton>
          </Link>
        )}
      </div>
      <div className="mt-5">
        {category?.id && <MenuList categoryId={category.id} />}
      </div>
    </>
  );
};
