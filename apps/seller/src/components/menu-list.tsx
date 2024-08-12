import { useSellerStore } from "@hackathon-qrmenu/store";
import { MenuItem } from "./menu-item";
import { useRouter, useSearchParams } from "next/navigation";
import { useLang } from "@/hooks/use-lang";
import { getCDNUrl, useDefaultQueryParams } from "@/utils";
import uswSWR, { useSWRConfig } from "swr";
import { LangCode, Menu } from "@hackathon-qrmenu/type";
import { apiClient } from "@hackathon-qrmenu/api-client";
import { Pagination } from "./pagination";
import { useParamsWithPagination } from "@/hooks/use-params-with-pagination";
import {
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Drag } from "./drag";
import update from "immutability-helper";
interface Request {
  categoryId?: number;
  sellerId: number | undefined;
  langCode: LangCode;
  pageOffset: string;
  pageLimit: string;
}

export const MenuList = ({
  categoryId,
  onTotalSize,
  renderCheckbox,
  empty,
  small,
}: {
  small?: boolean;
  empty?: boolean;
  categoryId?: number;
  renderCheckbox?: (menu: Menu, index: number) => ReactNode;
  onTotalSize?: (a: number) => void;
}) => {
  const sellerId = useSellerStore((s) => s.seller?.id);
  const searchParams = useSearchParams();
  const langCode = useLang();

  const requestParams = useDefaultQueryParams(
    searchParams,
    sellerId
      ? ({
          sellerId: sellerId,
          categoryId,
          langCode,
          pageLimit: "10",
          pageOffset: "0",
        } as Request)
      : undefined
  );

  const { params, setPageOffset } = useParamsWithPagination<Request>({
    sellerId: sellerId,
    categoryId: categoryId || undefined,
    langCode,
    pageLimit: "10",
    pageOffset: "0",
  });
  const { mutate } = useSWRConfig();

  const { data, isLoading, error } = uswSWR(
    requestParams.sellerId ? requestParams : null,
    () =>
      apiClient.get<{ totalSize: number; menus: Menu[] }>("/menu/menus", {
        params: requestParams,
      })
  );

  const [list, setList] = useState<Menu[]>([]);

  useEffect(() => {
    if (data?.data) {
      setList(data.data.menus);
    }
  }, [data?.data.menus]);

  useEffect(() => {
    if (data?.data && onTotalSize) {
      onTotalSize(data.data.totalSize);
    }
  }, [data, onTotalSize]);

  const router = useRouter();

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
      apiClient.post("/menu/menu_categories:swap", {
        data: list.map((x, i) => ({
          id: x.cat?.id,
          index: i + 1 + parseInt(params.pageOffset),
        })),
      });
    }, 500);

    return () => {
      clearTimeout(tm);
    };
  }, [list, params.pageOffset]);

  if (isLoading || error || !data?.data) return null;

  return (
    <div className="flex flex-col w-full">
      {list.map((x, i) => {
        const renderMenu = (
          <MenuItem
            menu={!!categoryId}
            id={x.id}
            small={small}
            content={x.translate?.description || ""}
            src={getCDNUrl(x.images[0]?.image?.key)}
            manage
            leftComponent={renderCheckbox ? renderCheckbox(x, i) : undefined}
            onDelete={() => {
              if (confirm("정말 메뉴를 삭제하시겠습니까?")) {
                apiClient
                  .delete(`/menu/menus/${x.id}`)
                  .then(() => {
                    mutate(requestParams);
                  })
                  .catch((e) => {
                    alert("삭제 실패했습니다.");
                  });
              }
            }}
            onEdit={() => {
              router.push(`/menus/${x.id}?lang=${langCode}`);
            }}
            onSoldout={() => {
              apiClient
                .patch(`/menu/menus/${x.id}`, {
                  menu: { isSoldOut: !x.isSoldOut },
                  updateMask: "isSoldOut",
                })
                .then(() => {
                  mutate(requestParams);
                  alert(
                    x.isSoldOut
                      ? "품절 해제되었습니다."
                      : "품절 처리되었습니다."
                  );
                })
                .catch((e) => {
                  alert("실패했습니다.");
                });
            }}
            isSoldOut={x.isSoldOut}
            isPrivate={x.isPrivate}
            name={x.translate?.name}
            prcie={
              x.optionGroups
                .find((x) => x.isDefault)
                ?.items.sort((a, b) => a.price - b.price)[0].price || 0
            }
          />
        );

        return (
          <Fragment key={x.id}>
            {categoryId ? (
              <Drag index={i} id={x.id} type="menu" move={move}>
                {renderMenu}
              </Drag>
            ) : (
              renderMenu
            )}
          </Fragment>
        );
      })}

      {data?.data.totalSize >= 1 && (
        <Pagination
          limit={parseInt(params.pageLimit)}
          offset={parseInt(params.pageOffset)}
          onOffsetChange={setPageOffset}
          totalSize={data.data.totalSize}
        />
      )}
      {data?.data && data?.data.totalSize === 0 && (
        <p className="text-center text-[#999] text-[14px]">
          등록된 메뉴가 없습니다.
          <br />
          메뉴를 추가해 주세요.
        </p>
      )}
    </div>
  );
};
