import { useDefaultQueryParams } from "@/utils";
import { apiClient } from "@hackathon-qrmenu/api-client";
import { useSellerStore } from "@hackathon-qrmenu/store";
import { LangCode } from "@hackathon-qrmenu/type";
import { useSearchParams } from "next/navigation";
import uswSWR, { useSWRConfig } from "swr";

interface Request {
  sellerId: number;
  langCode: string;
}

export function useCategories(langCode: LangCode) {
  const seller = useSellerStore((s) => s.seller);
  const searchParams = useSearchParams();

  const requestParams = useDefaultQueryParams(
    searchParams,
    seller?.id
      ? ({
          sellerId: seller.id!,
          langCode,
        } as Request)
      : undefined
  );

  const key = requestParams.sellerId
    ? {
        sellerId: requestParams.sellerId,
        langCode: langCode,
      }
    : null;
  const result = uswSWR(key, () =>
    apiClient.get("/menu/categories", { params: requestParams })
  );

  const { mutate } = useSWRConfig();

  return {
    ...result,
    mutate: () => {
      mutate(key);
    },
  };
}
