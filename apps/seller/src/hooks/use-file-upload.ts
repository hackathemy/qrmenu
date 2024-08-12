import { apiClient } from "@hackathon/api-client";
import { useCallback } from "react";

export function useFileUpload() {
  const handleUpload = useCallback(async (file: File) => {
    try {
      const { data } = await apiClient.post("/files", {
        size: file.size,
        fileName: file.name,
        contentType: file.type,
      });

      const {
        data: { signedUrl },
      } = await apiClient.post(
        "/files/" + data.file.id + ":generateSignedUrl",
        {
          method: "PUT",
        }
      );

      const form = new FormData();
      form.append("file", file);

      await fetch("/api/upload", {
        method: "POST",
        body: form,
        headers: {
          "x-signed-url": signedUrl,
        },
      });

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
