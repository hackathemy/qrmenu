import { useDefaultQueryParams } from "../utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { stringify } from "querystring";
import { useCallback, useEffect } from "react";
import { DefaultValues, Path, useForm } from "react-hook-form";

export function useParamsWithPagination<T extends Record<string, any>>(
  defaultValues: T
) {
  const searchParams = useSearchParams();

  const router = useRouter();
  const pathname = usePathname();

  const defaultQueryParams = useDefaultQueryParams<T>(
    searchParams,
    defaultValues
  );

  const form = useForm<T>({
    defaultValues: defaultQueryParams as DefaultValues<T>,
  });

  useEffect(() => {
    Object.entries(defaultQueryParams).map(([k, v]) => {
      form.setValue(k as Path<T>, v);
    });
  }, [defaultQueryParams]);

  const handleSetPageOffset = useCallback(
    (pageOffset: number) => {
      router.push(
        `${pathname}?${stringify({
          ...defaultQueryParams,
          pageOffset,
        })}`
      );
    },
    [pathname, defaultQueryParams]
  );

  const handleSetPageLimit = useCallback(
    (pageLimit: number) => {
      router.push(
        `${pathname}?${stringify({
          ...defaultQueryParams,
          pageLimit,
          pageOffset: 0,
        })}`
      );
    },
    [pathname, defaultQueryParams]
  );

  const handleSearch = useCallback(() => {
    const values = form.getValues();

    router.push(
      `${pathname}?${stringify({
        ...defaultQueryParams,
        ...values,
        pageOffset: 0,
      })}`
    );
  }, [defaultQueryParams]);

  return {
    /** paging 값은 params로 액세스 가능하고, 페이징 수정은 form이 아닌 아래 별도 함수 */
    params: defaultQueryParams,

    /** Paging 외에 값 검색 적용 시점에 호출합니다.
     * 값 변경과 값 적용(검색) 시점은 다를 수 있습니다.
     * ex) input 입력 끝낸 후 검색 버튼 클릭 시 etc */
    form,
    onSearch: handleSearch,

    setPageLimit: handleSetPageLimit,
    setPageOffset: handleSetPageOffset,
  };
}
