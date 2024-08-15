import { CategoryItem } from "@/components/category-item";
import { useLang } from "@/hooks/use-lang";
import { apiClient } from "@hackathemy-qrmenu/api-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AddButton } from "./add-button";
import { SmallBorderButton } from "@/components/small-border-button";
import { UpdateButton } from "./update-button";
import { Category, LangCode } from "@hackathemy-qrmenu/type";
import { useCategories } from "@/hooks/use-categories";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { stringify } from "querystring";
import { Drag } from "@/components/drag";
import update from "immutability-helper";
export const CategoryList = ({}: {}) => {
  const langCode = useLang();
  const router = useRouter();
  const pathbame = usePathname();
  const searchParams = useSearchParams();
  const { data, isLoading, error, mutate } = useCategories(langCode);

  const [list, setList] = useState<any[]>([]);
  const [edit, setEdit] = useState<Category | null>(null);

  useEffect(() => {
    if (data?.data.categories) {
      setList(data?.data.categories);
    }
  }, [data?.data.categories]);

  const [add, setAdd] = useState<boolean>(false);

  const movedRef = useRef(false);

  const move = useCallback((dragIndex: number, hoverIndex: number) => {
    movedRef.current = true;
    setList((prevCards: any[]) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex] as any],
        ],
      })
    );
  }, []);

  useEffect(() => {
    if (!movedRef.current) return;

    let tm = setTimeout(() => {
      apiClient.post(`/menu/categories:index`, {
        categoryIds: list.map((x) => x.id),
      });
    }, 500);

    return () => {
      clearTimeout(tm);
    };
  }, [list]);

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="font-bold">카테고리</span>
        {add && (
          <UpdateButton
            category={edit}
            onAdd={() => mutate()}
            onClose={() => {
              setAdd(false);
              setEdit(null);
            }}
          />
        )}

        {langCode === LangCode.KO && (
          <SmallBorderButton
            onClick={() => {
              setAdd(true);
            }}
          >
            카테고리 추가
          </SmallBorderButton>
        )}
      </div>
      {!isLoading && !error && data?.data && (
        <div className="mt-5 grid gap-y-3 max-[1440px]:grid-cols-2 max-[1440px]:gap-5">
          {list.map((x, i) => {
            return (
              <Drag id={x.id} index={i} move={move} type="category">
                <CategoryItem
                  key={x.id}
                  id={x.id}
                  onClick={() => {
                    router.push(
                      `${pathbame}?${stringify({
                        ...Object.fromEntries(searchParams),
                        ["category_id"]: x.id,
                      })}`
                    );
                  }}
                  onEdit={() => {
                    setEdit(x);
                    setAdd(true);
                  }}
                  name={x.translate?.name}
                  pri={x.isPrivate}
                  menuTotalSize={x.menuTotalSize}
                  onDelete={() => {
                    if (confirm("정말 삭제하시겠습니까?")) {
                      apiClient
                        .delete(`/menu/categories/${x.id}`)
                        .then(() => mutate())
                        .catch((e) => alert("삭제 실패했습니다."));
                    }
                  }}
                />
              </Drag>
            );
          })}
          {!data.data.categories.length && (
            <p className="text-center text-[#999] text-[14px]">
              등록된 카테고리가 없습니다.
              <br />
              카테고리를 추가해 주세요.
            </p>
          )}
        </div>
      )}
    </>
  );
};
