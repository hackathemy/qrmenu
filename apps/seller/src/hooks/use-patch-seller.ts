import { ApiError, apiClient } from "@hackathon/api-client";
import { useSellerStore } from "@hackathon/store";
import { Seller } from "@hackathon/type";
import { useCallback } from "react";

export function usePatchSeller() {
  const seller = useSellerStore((s) => s.seller);
  const setSeller = useSellerStore((s) => s.setSeller);

  const handlePatch = useCallback(
    async (updateSeller: Seller) => {
      try {
        const { data } = await apiClient.patch(`/sellers/${seller?.id}`, {
          seller: updateSeller,
          updateMask: Object.keys(updateSeller).join(","),
        });
        setSeller(data.seller);
      } catch (error: unknown) {
        const apiError = error as ApiError;

        console.error(apiError);
        alert("변경 실패했습니다.");
      }
    },
    [seller?.id]
  );

  return {
    patch: handlePatch,
  };
}
