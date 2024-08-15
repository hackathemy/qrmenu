import { apiClient } from "@hackathemy-qrmenu/api-client";
import { useCallback } from "react";

export function useFileUpload() {
  const handleUpload = useCallback(async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await apiClient.post("/files", formData);

      return {
        fileId: data.file.id,
        key: data.file.key,
      };
    } catch (error: unknown) {
      throw new Error("파일 업로드 실패했습니다.");
    }
  }, []);

  return {
    uplaod: handleUpload,
  };
}
